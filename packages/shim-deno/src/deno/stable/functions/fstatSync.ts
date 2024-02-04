///<reference path="../lib.deno.d.ts" />

import { fstatSync as nodeFstatSync } from "node:fs";
import { denoifyFileInfo } from "./stat.js";
import mapError from "../../internal/errorMap.js";

export const fstatSync: typeof Deno.fstatSync = function fstatSync(fd) {
  try {
    return denoifyFileInfo(nodeFstatSync(fd));
  } catch (err) {
    throw mapError(err);
  }
};
