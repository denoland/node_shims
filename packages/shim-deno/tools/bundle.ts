import $ from "https://deno.land/x/dax@0.38.0/mod.ts";

const rootDir = $.path(import.meta).join("../../").resolve();
$.cd(rootDir);
await $`deno run -A npm:esbuild@0.20.0 --bundle --platform=node --packages=external --outfile=bundle.cjs dist/script/index.js`;
await $`deno run -A npm:esbuild@0.20.0 --bundle --platform=node --packages=external --outfile=bundle.mjs --format=esm dist/esm/index.js`;
await $`mv bundle.cjs dist/index.cjs && mv bundle.mjs dist/index.mjs`;
await $`mv dist/script/test-internals.js dist/test-internals.cjs`;
await $`mv dist/esm/test-internals.js dist/test-internals.mjs`;
await $`rm -rf dist/script dist/esm`;

// basic mjs test
{
  const tempFile = $.path("temp_file.mjs");
  tempFile.writeText(
    `import { testDefinitions } from "./dist/test-internals.mjs";
import { Deno } from "./dist/index.mjs";

console.log(testDefinitions);
console.log(Deno);
if (Deno.writeTextFileSync) {
}
`,
  );
  try {
    // just ensure it doesn't throw
    await $`node ${tempFile}`.quiet();
  } finally {
    tempFile.removeSync();
  }
}

// basic cjs test
{
  const tempFile = $.path("temp_file.cjs");
  tempFile.writeText(
    `const { testDefinitions } = require("./dist/test-internals.cjs");
const { Deno } = require("./dist/index.cjs");

console.log(testDefinitions);
console.log(Deno);
if (!(testDefinitions instanceof Array)) throw "NOT ARRAY";
if (Deno.writeTextFileSync == null) throw "NOT FOUND";
`,
  );
  try {
    // just ensure it doesn't throw
    await $`node ${tempFile}`.quiet();
  } finally {
    tempFile.removeSync();
  }
}
