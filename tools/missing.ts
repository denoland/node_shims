#!/usr/bin/env -S deno run --allow-read=src/deno/

const wontAdd = new Set([
  // internals
  "core",
  "internal",

  // deprecated
  "iter",
  "iterSync",
  "readAll",
  "readAllSync",
  "writeAll",
  "writeAllSync",
  "Buffer",
]);

const count = wontAdd.size;
const total = Object.keys(Deno).length;

let added = 0;
for await (const dirEntry of Deno.readDir("src/deno")) {
  wontAdd.add(dirEntry.name.slice(0, -3));
  added++;
}

for (const key of Object.keys(Deno).sort()) {
  if (!wontAdd.has(key)) console.log(key);
}

console.log(
  `${added} (remaining: ${total - added}) / ${total - count} (total: ${total})`,
);
