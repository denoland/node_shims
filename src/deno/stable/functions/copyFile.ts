///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";
import mapError from "../../internal/errorMap.js";

export const copyFile: typeof Deno.copyFile = async (src, dest) => {
  try {
    await fs.copyFile(src, dest);
  } catch (error) {
    throw mapError(error);
  }
};
