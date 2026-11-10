import { html, inline } from "../lib/html.mjs";

export const file = "research.html";

export function research({ research, papers }) {
  const byId = new Map(papers.map((p) => [p.id, p]));
  return {
    file,
    title: research.title,
    description: research.lead,
    body: html`
    <section class="wrap page-head">
      <h1>${research.title}</h1>
      <p class="lead">${inline(research.lead)}</p>
    </section>
    <div class="wrap themes">
      ${research.themes.map((t) => {
        const related = t.papers.map((id) => byId.get(id)).filter(Boolean);
        return html`<section class="theme" id="${t.id}">
          <p class="eyebrow">${t.status}</p>
          <h2>${t.title}</h2>
          ${t.body.map((p) => html`<p>${inline(p)}</p>`)}
          ${related.length
            ? html`<div class="related"><h3>Related papers</h3>
                <ul>${related.map(
                  (p) => html`<li><a href="${`https://arxiv.org/abs/${p.id}`}" rel="noopener noreferrer" target="_blank">${p.title}</a> <span class="muted">(${p.published.slice(0, 4)})</span></li>`,
                )}</ul></div>`
            : ""}
        </section>`;
      })}
    </div>`,
  };
}
