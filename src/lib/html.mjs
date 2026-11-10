// Minimal, dependency-free HTML helpers.
//
// Security model: every string that reaches the page is escaped by default.
// Markup is only emitted through `html` template literals, which escape every
// interpolated value unless it was explicitly marked safe with `raw()`.
// Content files (JSON) and arXiv data are therefore never trusted.

class Raw {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/** Mark an already-safe HTML string. Use only on output of this module. */
export const raw = (value) => new Raw(String(value));

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

function render(value) {
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(render).join("");
  if (value === null || value === undefined || value === false) return "";
  return esc(value);
}

/** Tagged template: interpolations are escaped unless wrapped in raw(). */
export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((v, i) => {
    out += render(v) + strings[i + 1];
  });
  return new Raw(out);
}

const SAFE_URL = /^(https:\/\/|mailto:|\/|\.\/|\.\.\/|#|[a-z0-9_-]+(\.html)?(#.*)?$)/i;

/** Only allow https, mailto and relative URLs (blocks javascript:, data:, http:). */
export function safeUrl(url) {
  const u = String(url ?? "").trim();
  return SAFE_URL.test(u) ? u : "#";
}

/**
 * Inline formatting for content strings: escapes everything, then supports
 *   [text](url)   links (URL allow-listed, external links get rel="noopener")
 *   *emphasis*    italics
 * LaTeX such as $x^2$ passes through untouched for MathJax.
 */
export function inline(text) {
  const escaped = esc(text);
  const withLinks = escaped.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    const href = safeUrl(url.replace(/&amp;/g, "&"));
    const external = /^https:\/\//i.test(href);
    const attrs = external ? ' rel="noopener noreferrer" target="_blank"' : "";
    return `<a href="${esc(href)}"${attrs}>${label}</a>`;
  });
  // Italics, but never inside math ($...$) where * can be an operator.
  const parts = withLinks.split(/(\$[^$]*\$)/g);
  const out = parts
    .map((p, i) => (i % 2 === 1 ? p : p.replace(/\*([^*\n]+)\*/g, "<em>$1</em>")))
    .join("");
  return raw(out);
}

/** Encode an e-mail address as numeric entities to deter naive scrapers. */
export function obfuscate(text) {
  return raw([...String(text)].map((c) => `&#${c.codePointAt(0)};`).join(""));
}
