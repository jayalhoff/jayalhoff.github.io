// Parse the arXiv Atom feed without dependencies. Kept separate from the
// network code so it can be unit-tested.

const ID_RE = /^(\d{4}\.\d{4,5}|[a-z-]+(\.[A-Z]{2})?\/\d{7})$/;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code < 0x110000 ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

const clean = (s) => decode(s).replace(/\s+/g, " ").trim();

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? clean(m[1]) : "";
}

function attr(block, tagName, attribute) {
  const m = block.match(new RegExp(`<${tagName}\\s[^>]*?${attribute}="([^"]*)"`));
  return m ? decode(m[1]) : "";
}

/** Returns [{id, version, title, authors, published, updated, abstract, ...}] */
export function parseFeed(xml) {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const papers = [];
  for (const e of entries) {
    const absUrl = tag(e, "id");
    const m = absUrl.match(/arxiv\.org\/abs\/(.+?)(?:v(\d+))?$/);
    if (!m || !ID_RE.test(m[1])) continue; // refuse anything unexpected
    const authors = [...e.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g)].map((a) =>
      clean(a[1]),
    );
    const categories = [...e.matchAll(/<category\s[^>]*?term="([^"]+)"/g)].map((c) => decode(c[1]));
    papers.push({
      id: m[1],
      version: m[2] ? Number(m[2]) : 1,
      title: tag(e, "title"),
      authors,
      published: tag(e, "published"),
      updated: tag(e, "updated"),
      abstract: tag(e, "summary"),
      primaryCategory: attr(e, "arxiv:primary_category", "term") || categories[0] || "",
      categories,
      journalRef: tag(e, "arxiv:journal_ref"),
      doi: tag(e, "arxiv:doi"),
      comment: tag(e, "arxiv:comment"),
    });
  }
  return papers;
}
