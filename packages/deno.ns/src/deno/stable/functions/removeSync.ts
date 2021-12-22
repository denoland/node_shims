///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const removeSync: typeof Deno.removeSync = (path, options = {}) =>
  fs.rmSync(path, options.recursive ? { recursive: true, force: true } : {});
