// Static site generator: content/*.json + data/papers.json + src/ → dist/
//   node scripts/build.mjs
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { html } from "../src/lib/html.mjs";
import { layout } from "../src/lib/layout.mjs";
import { about } from "../src/pages/about.mjs";
import { research } from "../src/pages/research.mjs";
import { writing } from "../src/pages/writing.mjs";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
const json = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));

const site = await json("content/site.json");
const ctx = {
  site,
  about: await json("content/about.json"),
  research: await json("content/research.json"),
};
const data = await json("data/papers.json");
ctx.papers = data.papers;
ctx.meta = { fetchedAt: data.fetchedAt };

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(new URL("src/assets/", root), new URL("assets/", dist), { recursive: true });

// Register pages here. Each page is a function (ctx) => {file, title, body}.
const pages = [about, research, writing];
for (const make of pages) {
  const page = make(ctx);
  const out = layout({ site, page, body: page.body });
  await writeFile(new URL(page.file, dist), out.toString());
}
// Plain 404 for GitHub Pages
const nf = layout({ site, page: { file: "404.html", title: "Not found", description: site.description }, body: html`<section class="wrap page-head"><h1>Page not found</h1><p class="lead"><a href="index.html">Back to the home page</a></p></section>`, math: false });
await writeFile(new URL("404.html", dist), nf.toString());
await writeFile(new URL(".nojekyll", dist), "");
console.log(`Built ${pages.length + 1} pages → ${fileURLToPath(dist)}`);
