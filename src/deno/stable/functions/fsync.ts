///<reference path="../lib.deno.d.ts" />

import { fsync as nodeFsync } from "fs";
import { promisify } from "util";

export const fsync: typeof Deno.fsync = function fsync(rid) {
  return promisify(nodeFsync)(rid);
};
