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

for await (const dirEntry of Deno.readDir("src/deno")) {
  wontAdd.add(dirEntry.name.slice(0, -3));
}

for (const key of Object.keys(Deno).sort()) {
  if (!wontAdd.has(key)) console.log(key);
}
