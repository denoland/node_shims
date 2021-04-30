///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const readTextFileSync: typeof Deno.readTextFileSync = (path) =>
  fs.readFileSync(path, "utf8");
