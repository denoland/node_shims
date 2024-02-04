///<reference path="../lib.deno.d.ts" />

import { rm, rmdir } from "node:fs/promises";

export const remove: typeof Deno.remove = async function remove(
  path,
  options = {},
) {
  const innerOptions = options.recursive
    ? { recursive: true, force: true }
    : {};
  try {
    return await rm(path, innerOptions);
  } catch (err) {
    if ((err as any).code === "ERR_FS_EISDIR") {
      return await rmdir(path, innerOptions);
    } else {
      throw err;
    }
  }
};
