///<reference path="../lib.deno.d.ts" />

import { rm } from "fs/promises";

export const remove: typeof Deno.remove = function remove(
  path,
  options = {},
) {
  return rm(path, options.recursive ? { recursive: true, force: true } : {});
};
