///<reference path="../lib.deno.d.ts" />

import { fsyncSync as nodeFsyncSync } from "fs";

export const fsyncSync: typeof Deno.fsyncSync = function (rid) {
  return nodeFsyncSync(rid);
};
