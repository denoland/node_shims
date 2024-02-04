///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";
import { denoifyFileInfo } from "./stat.js";
import mapError from "../../internal/errorMap.js";

export const lstatSync: typeof Deno.lstatSync = (path) => {
  try {
    return denoifyFileInfo(fs.lstatSync(path));
  } catch (err) {
    throw mapError(err);
  }
};
