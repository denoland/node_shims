///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";
import mapError from "../../internal/errorMap.js";
import * as errors from "../variables/errors.js";

export const copyFile: typeof Deno.copyFile = async (src, dest) => {
  try {
    await fs.copyFile(src, dest);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      throw new errors.NotFound(`File not found, copy '${src}' -> '${dest}'`);
    }
    throw mapError(error);
  }
};
