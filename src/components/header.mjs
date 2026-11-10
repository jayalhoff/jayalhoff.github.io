import { html } from "../lib/html.mjs";

export function header(site, currentFile) {
  return html`<header class="site-header">
    <div class="wrap bar">
      ${currentFile === "index.html" ? "" : html`<a class="brand" href="index.html">${site.name}</a>`}
      <nav aria-label="Main">
        <ul>
          ${site.nav.map(
            (item) => html`<li><a href="${item.href}"${item.href === currentFile ? html` aria-current="page"` : ""}>${item.label}</a></li>`,
          )}
        </ul>
      </nav>
    </div>
  </header>`;
}
