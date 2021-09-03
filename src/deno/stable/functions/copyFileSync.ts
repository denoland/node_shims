///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import mapError from "../../internal/errorMap.js";

export const copyFileSync: typeof Deno.copyFileSync = (src, dest) => {
  try {
    fs.copyFileSync(src, dest);
  } catch (error) {
    throw mapError(error);
  }
};
