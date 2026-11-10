// Fetches the author's papers from the arXiv API and writes data/papers.json.
//
//   node scripts/fetch-arxiv.mjs
//
// Safe by design: HTTPS only, fixed host, timeout, parsed output is validated,
// and the existing data file is never overwritten with an empty/failed result.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseFeed } from "./arxiv-parse.mjs";

const root = new URL("../", import.meta.url);
const read = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));

const API = "https://export.arxiv.org/api/query";

async function query(searchQuery, maxResults) {
  const url = new URL(API);
  url.searchParams.set("search_query", searchQuery);
  url.searchParams.set("start", "0");
  url.searchParams.set("max_results", String(maxResults));
  url.searchParams.set("sortBy", "submittedDate");
  url.searchParams.set("sortOrder", "descending");
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000), redirect: "follow" });
  if (!res.ok) throw new Error(`arXiv API returned ${res.status}`);
  return parseFeed(await res.text());
}

async function byIds(ids) {
  if (!ids.length) return [];
  const url = new URL(API);
  url.searchParams.set("id_list", ids.join(","));
  url.searchParams.set("max_results", String(ids.length));
  const res = await fetch(url, { signal: AbortSignal.timeout(20_000), redirect: "follow" });
  if (!res.ok) throw new Error(`arXiv API returned ${res.status}`);
  return parseFeed(await res.text());
}

async function main() {
  const cfg = await read("content/arxiv.json");
  const exclude = new Set(cfg.exclude ?? []);
  const found = new Map();

  for (const q of cfg.queries) {
    for (const p of await query(q, cfg.maxResults ?? 100)) found.set(p.id, p);
    await new Promise((r) => setTimeout(r, 3000)); // arXiv asks for ≥3s between calls
  }
  for (const p of await byIds(cfg.include ?? [])) found.set(p.id, p);

  const papers = [...found.values()]
    .filter((p) => !exclude.has(p.id))
    .sort((a, b) => b.published.localeCompare(a.published));

  if (papers.length === 0) throw new Error("arXiv returned no papers; keeping existing data.");

  const out = { fetchedAt: new Date().toISOString(), source: "arxiv.org", papers };
  await writeFile(new URL("data/papers.json", root), JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${papers.length} papers to data/papers.json`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(`fetch-arxiv: ${err.message}`);
    process.exit(1);
  });
}
