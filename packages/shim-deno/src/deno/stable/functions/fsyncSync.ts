///<reference path="../lib.deno.d.ts" />

import { fsyncSync as nodeFsyncSync } from "node:fs";

export const fsyncSync: typeof Deno.fsyncSync = function fsyncSync(rid) {
  return nodeFsyncSync(rid);
};
