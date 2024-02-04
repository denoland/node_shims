///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const removeSync: typeof Deno.removeSync = (path, options = {}) => {
  const innerOptions = options.recursive
    ? { recursive: true, force: true }
    : {};
  try {
    fs.rmSync(path, innerOptions);
  } catch (err) {
    if ((err as any).code === "ERR_FS_EISDIR") {
      fs.rmdirSync(path, innerOptions);
    } else {
      throw err;
    }
  }
};
