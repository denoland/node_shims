///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";
import { denoifyFileInfo } from "./stat.js";
import mapError from "../../internal/errorMap.js";

export const statSync: typeof Deno.statSync = (path) => {
  try {
    return denoifyFileInfo(fs.statSync(path));
  } catch (err) {
    throw mapError(err);
  }
};
