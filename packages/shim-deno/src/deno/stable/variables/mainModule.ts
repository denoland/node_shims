///<reference path="../lib.deno.d.ts" />
import { join } from "path";
import { pathToFileURL } from "url";

export const mainModule: typeof Deno.mainModule = pathToFileURL(
  process.argv[1] ?? join(Deno.cwd(), "$deno$repl.ts"),
).href;
