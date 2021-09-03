///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import mapError from "../../internal/errorMap.js";

export const mkdirSync: typeof Deno.mkdirSync = (path, options) => {
  try {
    fs.mkdirSync(path, options);
  } catch (error) {
    throw mapError(error);
  }
};
