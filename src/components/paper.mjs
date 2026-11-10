import { html, esc } from "../lib/html.mjs";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { year: "numeric", month: "short", timeZone: "UTC" });

/** One paper entry. All fields come from arXiv and are escaped by `html`. */
export function paperCard(p, { abstract = true } = {}) {
  const abs = `https://arxiv.org/abs/${p.id}`;
  const pdf = `https://arxiv.org/pdf/${p.id}`;
  return html`<article class="paper">
    <h3><a href="${abs}" rel="noopener noreferrer" target="_blank">${p.title}</a></h3>
    <p class="authors">${p.authors.join(", ")}</p>
    <p class="meta">
      <span>arXiv:${p.id}</span>
      <span>${p.primaryCategory}</span>
      <time datetime="${p.published.slice(0, 10)}">${fmtDate(p.published)}</time>
      ${p.journalRef ? html`<span>${p.journalRef}</span>` : ""}
    </p>
    ${abstract && p.abstract
      ? html`<details><summary>Abstract</summary><p>${p.abstract}</p></details>`
      : ""}
    <p class="links">
      <a href="${abs}" rel="noopener noreferrer" target="_blank">arXiv</a>
      <a href="${pdf}" rel="noopener noreferrer" target="_blank">PDF</a>
      ${p.doi ? html`<a href="${`https://doi.org/${p.doi}`}" rel="noopener noreferrer" target="_blank">DOI</a>` : ""}
    </p>
  </article>`;
}
