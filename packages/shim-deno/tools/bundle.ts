import $ from "https://deno.land/x/dax@0.38.0/mod.ts";

const rootDir = $.path(import.meta).join("../../").resolve();
$.cd(rootDir);
await $`deno run -A npm:esbuild@0.20.0 --bundle --platform=node --packages=external --outfile=bundle.js dist/index.js`;
await $`mv bundle.js dist/index.js`;
await $`rm -rf dist/deno`;
