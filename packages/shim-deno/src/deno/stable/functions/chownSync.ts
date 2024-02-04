///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";

export const chownSync: typeof Deno.chownSync = (path, uid, gid) =>
  fs.chownSync(path, uid ?? -1, gid ?? -1);
