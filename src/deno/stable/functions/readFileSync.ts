///<reference path="../lib.deno.d.ts" />

import { readFileSync as nodeReadFile } from "fs";

export const readFileSync: typeof Deno.readFileSync = function readFileSync(
  path,
) {
  return nodeReadFile(path);
};
