import { html } from "../lib/html.mjs";

export function footer(site) {
  const year = new Date().getFullYear();
  return html`<footer class="site-footer">
    <div class="wrap">
      <p>© ${year} ${site.name} · ${site.affiliation.institution}, ${site.affiliation.city}</p>
    </div>
  </footer>`;
}
