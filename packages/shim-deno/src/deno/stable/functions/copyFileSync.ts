///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";
import mapError from "../../internal/errorMap.js";
import * as errors from "../variables/errors.js";

export const copyFileSync: typeof Deno.copyFileSync = (src, dest) => {
  try {
    fs.copyFileSync(src, dest);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      throw new errors.NotFound(`File not found, copy '${src}' -> '${dest}'`);
    }
    throw mapError(error);
  }
};
