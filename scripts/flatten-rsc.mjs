// Runs after `next build` (npm "postbuild"). Next 16's static export writes the RSC payload of a dynamic segment
// nested (out/cases/dompi/__next.cases/$d$slug/__PAGE__.txt), while the client router fetches the flat name
// (out/cases/dompi/__next.cases.$d$slug.__PAGE__.txt). Without the flat copy every client navigation and prefetch
// to a case study 404s and falls back to a full page load. This copies each nested file to its flat name.
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";

function walk(dir, visit) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, visit);
    else visit(path);
  }
}

if (!existsSync(OUT)) {
  console.error("flatten-rsc: no out/ folder; run next build first");
  process.exit(1);
}

let copied = 0;
walk(OUT, (file) => {
  const parts = relative(OUT, file).split(sep);
  // The first path part that starts with "__next." and is a folder begins a nested payload name.
  const start = parts.findIndex((p, i) => p.startsWith("__next.") && i < parts.length - 1);
  if (start === -1) return;
  const flat = join(OUT, ...parts.slice(0, start), parts.slice(start).join("."));
  if (!existsSync(flat)) {
    copyFileSync(file, flat);
    copied++;
  }
});
console.log(`flatten-rsc: ${copied} payload file(s) copied to their flat names`);
