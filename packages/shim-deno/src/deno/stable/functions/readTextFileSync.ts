///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";
import mapError from "../../internal/errorMap.js";

export const readTextFileSync: typeof Deno.readTextFileSync = function (path) {
  try {
    return fs.readFileSync(path, "utf8");
  } catch (e) {
    throw mapError(e);
  }
};
