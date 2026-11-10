import { html, esc, raw } from "./html.mjs";
import { header } from "../components/header.mjs";
import { footer } from "../components/footer.mjs";

// Strict Content-Security-Policy. GitHub Pages cannot set HTTP headers, so it is
// delivered via <meta>. No third-party origins: scripts, fonts and images are
// all self-hosted. 'unsafe-inline' is for styles only (MathJax injects <style>).
const CSP = [
  "default-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

/**
 * Wraps page content in the shared document shell.
 * @param {object} p  { site, page: {title, description, file}, body, math }
 */
export function layout({ site, page, body, math = true }) {
  const title = page.title ? `${page.title} · ${site.name}` : site.name;
  const description = page.description ?? site.description;
  return html`<!doctype html>
<html lang="${site.lang}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/main.css">
  ${math ? raw(`<script src="assets/js/math-config.js" defer></script>\n  <script src="assets/vendor/mathjax/tex-svg.js" defer></script>`) : ""}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  ${header(site, page.file)}
  <main id="main">
    ${body}
  </main>
  ${footer(site)}
</body>
</html>
`;
}
