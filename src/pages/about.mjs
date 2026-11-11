import { html, inline } from "../lib/html.mjs";

export const file = "index.html";

export function about({ site, about }) {
  return {
    file,
    title: "",
    body: html`
    <section class="hero wrap">
      <div class="hero-text">
        <h1 class="sr-only">${site.name}</h1>
        ${about.intro.map((p) => html`<p>${inline(p)}</p>`)}
      </div>
      <figure class="hero-photo">
        <img src="${about.photo.src}" alt="${about.photo.alt}" width="${about.photo.width}" height="${about.photo.height}" fetchpriority="high">
      </figure>
    </section>
`,
  };
}
