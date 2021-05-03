#!/usr/bin/env -S deno run --no-check --allow-read='.'
import { Project } from "https://deno.land/x/ts_morph@10.0.2/mod.ts";

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

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
  skipAddingFilesFromTsConfig: true,
  compilerOptions: { types: [] },
});
const sourceFile = project.addSourceFileAtPath("./src/deno.ts");
const added = sourceFile.getExportedDeclarations();
const properties = Object.keys(Deno).sort();
const pad = (n: number) => n.toString().padStart(3);

console.info("%s properties total", pad(properties.length));
console.info("%s wontfix", pad(wontAdd.size));
console.info("%s added", pad(added.size));
console.info("%s to go:", pad(properties.length - wontAdd.size - added.size));
for (const property of properties) {
  if (!wontAdd.has(property) && !added.has(property)) console.log(property);
}
