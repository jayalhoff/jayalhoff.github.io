import test from "node:test";
import assert from "node:assert/strict";
import { html, inline, esc, safeUrl } from "../src/lib/html.mjs";
import { parseFeed } from "../scripts/arxiv-parse.mjs";

test("html escapes interpolations", () => {
  assert.equal(html`<p>${"<script>alert(1)</script>"}</p>`.toString(), "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>");
});

test("inline blocks javascript: and http: links, keeps math", () => {
  assert.match(inline("[x](javascript:alert(1))").toString(), /href="#"/);
  assert.match(inline("[x](http://a.b)").toString(), /href="#"/);
  assert.match(inline("[x](https://a.b)").toString(), /href="https:\/\/a.b" rel="noopener noreferrer"/);
  assert.equal(inline("$a*b*c$ and *it*").toString(), "$a*b*c$ and <em>it</em>");
});

test("safeUrl", () => {
  assert.equal(safeUrl("data:text/html,x"), "#");
  assert.equal(safeUrl("research.html"), "research.html");
});

test("arXiv feed parsing escapes nothing itself but decodes entities and rejects bad ids", () => {
  const entry = (id) => `<entry><id>http://arxiv.org/abs/${id}v2</id><title>A &amp; B $C^1$</title><published>2020-01-01T00:00:00Z</published><summary> x
 y </summary><author><name>José</name></author><arxiv:primary_category xmlns:arxiv="x" term="math.GT"/></entry>`;
  const out = parseFeed(`<feed>${entry("1403.4899")}${entry("evil\"><script>")}</feed>`);
  assert.equal(out.length, 1);
  assert.equal(out[0].title, "A & B $C^1$");
  assert.equal(out[0].abstract, "x y");
  assert.equal(out[0].primaryCategory, "math.GT");
  assert.equal(esc(out[0].title), "A &amp; B $C^1$");
});
