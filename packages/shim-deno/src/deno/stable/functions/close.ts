///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

import { appends, positions } from "./seekSync.js";

export const close: typeof Deno.close = function close(fd) {
  fs.closeSync(fd);
  positions.delete(fd);
  appends.delete(fd);
};
