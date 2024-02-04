///<reference path="../lib.deno.d.ts" />
import { join } from "node:path";
import { pathToFileURL } from "node:url";

let mainFileName: string | undefined;
if (typeof require === "function" && typeof module !== "undefined") {
  mainFileName = require.main?.filename;
} else {
  mainFileName = process.argv[1];
}

export const mainModule: typeof Deno.mainModule = pathToFileURL(
  mainFileName ?? join(Deno.cwd(), "$deno$repl.ts"),
).href;
