import { html } from "../lib/html.mjs";
import { paperCard } from "../components/paper.mjs";

export const file = "writing.html";

export function writing({ papers, meta }) {
  const synced = meta.fetchedAt ? meta.fetchedAt.slice(0, 10) : "";
  return {
    file,
    title: "Writing",
    description: "Preprints and papers on arXiv.",
    body: html`
    <section class="wrap page-head">
      <h1>Writing</h1>
      <p class="lead">Preprints, listed automatically from <a href="https://arxiv.org" rel="noopener noreferrer" target="_blank">arXiv</a>. ${papers.length} papers${synced ? html` · last synced <time datetime="${synced}">${synced}</time>` : ""}.</p>
    </section>
    <div class="wrap">
      <section class="year">
        ${papers.map((p) => paperCard(p))}
      </section>
    </div>`,
  };
}
