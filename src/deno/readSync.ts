///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const readSync: typeof Deno.readSync = (fd, buffer) => {
  return fs.readSync(fd, buffer) || null;
};
