// Tiny local preview server for dist/ (development only).
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json" };
const port = Number(process.env.PORT) || 4173;

createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
    if (p.endsWith("/")) p += "index.html";
    const full = join(dist, p);
    if (!full.startsWith(dist)) throw new Error("outside dist");
    const body = await readFile(full);
    res.writeHead(200, { "content-type": types[extname(full)] ?? "application/octet-stream", "x-content-type-options": "nosniff" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${port}`));
