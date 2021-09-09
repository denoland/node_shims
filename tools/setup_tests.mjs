import { createRequire } from "module";

// set missing CJS globals to dummy values
// required by Deno.mainModule
globalThis.require = createRequire(import.meta.url);
globalThis.__dirname = "";

// let Deno tests access thirdparty/deno/cli/tests/fixture.json
process.chdir("thirdparty/deno/");

await import("../src/global.ts");
