///<reference path="../lib.deno.d.ts" />
import { join } from "path";
import { pathToFileURL } from "url";

export const mainModule: typeof Deno.mainModule = pathToFileURL(
  require.main?.filename ?? join(__dirname, "$deno$repl.ts"),
).href;
