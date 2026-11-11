import { html } from "../lib/html.mjs";
import { paperCard } from "../components/paper.mjs";

export const file = "writing.html";

export function writing({ papers }) {
  return {
    file,
    title: "Writing",
    description: "Preprints and papers on arXiv.",
    body: html`
    <section class="wrap page-head">
      <h1 class="sr-only">Writing</h1>
    </section>
    <div class="wrap">
      <section class="year">
        ${papers.map((p) => paperCard(p))}
      </section>
    </div>`,
  };
}
