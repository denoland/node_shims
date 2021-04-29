///<reference path="../lib.deno.d.ts" />

import { rename as node_rename } from "fs/promises";

export const rename: typeof Deno.rename = async function rename(
  oldpath,
  newpath,
) {
  return node_rename(oldpath, newpath);
};
