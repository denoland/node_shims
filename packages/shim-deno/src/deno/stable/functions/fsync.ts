///<reference path="../lib.deno.d.ts" />

import { fsync as nodeFsync } from "node:fs";
import { promisify } from "node:util";

export const fsync: typeof Deno.fsync = function fsync(rid) {
  return promisify(nodeFsync)(rid);
};
