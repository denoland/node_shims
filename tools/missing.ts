#!/usr/bin/env -S deno run --allow-run
///<reference path="../src/lib.deno.d.ts" />

const deprecated: string[] = JSON.parse(new TextDecoder().decode(
  await Deno.run({
    cmd: ["deno", "doc", "--json"],
    stdout: "piped",
  }).output(),
))
  .find((x: { name: string }) => x.name === "Deno").namespaceDef.elements
  .filter((x: { jsDoc?: string }) => x.jsDoc?.includes("@deprecated"))
  .map((x: { name: string }) => x.name);

const wontAdd = new Set([
  // internals
  "core",
  "internal",

  // deprecated
  ...deprecated,
]);

const added = new Set(JSON.parse(new TextDecoder().decode(
  await Deno.run({
    cmd: [
      "node",
      "-r",
      "./dist/global",
      "-p",
      "JSON.stringify(Object.keys(Deno))",
    ],
    stdout: "piped",
  }).output(),
)));
const properties = Object.keys(Deno).sort();
const pad = (n: number) => n.toString().padStart(3);

console.info("%s properties total", pad(properties.length));
console.info("%s wontfix", pad(wontAdd.size));
console.info("%s added", pad(added.size));
console.info("%s to go", pad(properties.length - wontAdd.size - added.size));
if (Deno.args.includes("all")) {
  console.log("\nMissing properties:\n");
  for (const property of properties) {
    if (!wontAdd.has(property) && !added.has(property)) console.log(property);
  }
}
