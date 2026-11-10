# José Ayala Hoffmann — academic website

Static site (About · Research · Writing) for GitHub Pages. **No runtime dependencies**, no third-party requests: MathJax 3.2.2 is self-hosted and the page ships a strict Content-Security-Policy.

## Structure

```
content/      Editable content (JSON): site.json, about.json, research.json, arxiv.json
data/         papers.json — generated from arXiv (committed as an offline fallback)
src/
  lib/        html.mjs (escaping), layout.mjs (page shell + CSP)
  components/ header, footer, paper card
  pages/      about, research, writing  (one function each)
  assets/     css, js, img, vendor/mathjax
scripts/      fetch-arxiv.mjs, build.mjs, serve.mjs
tests/        node --test
```

## Commands

```
npm run fetch   # refresh data/papers.json from arXiv
npm run dev     # build + preview at http://127.0.0.1:4173
npm run build   # output in dist/
npm test
```

## Everyday tasks

- **Edit text**: change the JSON in `content/`. Math works with `$...$`; links with `[text](https://...)`.
- **Hide a wrong paper** (same-name author): add its id to `exclude` in `content/arxiv.json`.
- **Add a paper arXiv doesn't list under his name**: add it to `include`.
- **Link a paper to a research theme**: add its id to `papers` in `content/research.json`.
- **New page**: create `src/pages/foo.mjs`, register it in `scripts/build.mjs` and `content/site.json` (`nav`).

## Deploy

Push to `main`. In the repo: *Settings → Pages → Source: GitHub Actions*. The workflow (`.github/workflows/deploy.yml`) runs tests, refreshes arXiv (weekly and on every push), builds and publishes.
