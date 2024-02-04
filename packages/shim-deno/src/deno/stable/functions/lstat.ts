///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs/promises";
import { denoifyFileInfo } from "./stat.js";
import mapError from "../../internal/errorMap.js";

export const lstat: typeof Deno.lstat = async (path) => {
  try {
    return denoifyFileInfo(await fs.lstat(path));
  } catch (e) {
    throw mapError(e);
  }
};
