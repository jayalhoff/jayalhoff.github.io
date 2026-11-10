import { html, inline, obfuscate } from "../lib/html.mjs";
import { paperCard } from "../components/paper.mjs";

export const file = "index.html";

export function about({ site, about, papers }) {
  const a = site.affiliation;
  const latest = papers.slice(0, about.latestCount);
  const mail = obfuscate(site.email);
  return {
    file,
    title: "",
    body: html`
    <section class="hero wrap">
      <div class="hero-text">
        <p class="eyebrow">${about.eyebrow}</p>
        <h1>${site.name}</h1>
        <p class="affil">${a.institution} · ${a.unit} · ${a.city}</p>
        <p class="headline">${about.headline}</p>
        ${about.intro.map((p) => html`<p>${inline(p)}</p>`)}
        <ul class="chips" aria-label="Research interests">
          ${about.interests.map((i) => html`<li>${i}</li>`)}
        </ul>
        <p class="cta">
          <a class="btn" href="research.html">Read about my research</a>
          <a class="btn ghost" href="${`mailto:${site.email}`}">${mail}</a>
        </p>
      </div>
      <figure class="hero-photo">
        <img src="${about.photo.src}" alt="${about.photo.alt}" width="${about.photo.width}" height="${about.photo.height}" fetchpriority="high">
      </figure>
    </section>

    <section class="wrap block">
      <div class="block-head">
        <h2>Latest writing</h2>
        <a href="writing.html">All papers →</a>
      </div>
      ${latest.map((p) => paperCard(p, { abstract: false }))}
    </section>`,
  };
}
