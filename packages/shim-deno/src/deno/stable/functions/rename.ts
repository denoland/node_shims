///<reference path="../lib.deno.d.ts" />

import { rename as nodeRename } from "node:fs/promises";

export const rename: typeof Deno.rename = function rename(oldpath, newpath) {
  return nodeRename(oldpath, newpath);
};
