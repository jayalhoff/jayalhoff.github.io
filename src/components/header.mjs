import { html } from "../lib/html.mjs";

export function header(site, currentFile) {
  return html`<header class="site-header">
    <div class="wrap bar">
      <nav aria-label="Main">
        <ul>
          ${site.nav.filter((item) => !item.hidden).map(
            (item) => html`<li><a href="${item.href}"${item.href === currentFile ? html` aria-current="page"` : ""}>${item.label}</a></li>`,
          )}
        </ul>
      </nav>
    </div>
  </header>`;
}
