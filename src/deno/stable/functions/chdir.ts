///<reference path="../lib.deno.d.ts" />

import { fileURLToPath } from "url";
import mapError from "../../internal/errorMap.js";

export const chdir: typeof Deno.chdir = function (path: string | URL) {
  try {
    return process.chdir(path instanceof URL ? fileURLToPath(path) : path);
  } catch (error) {
    throw mapError(error);
  }
};
