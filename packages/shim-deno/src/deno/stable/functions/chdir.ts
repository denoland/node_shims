///<reference path="../lib.deno.d.ts" />

import { fileURLToPath } from "url";
import mapError from "../../internal/errorMap.js";
import { errors } from "../variables.js";

export const chdir: typeof Deno.chdir = function (path: string | URL) {
  try {
    return process.chdir(path instanceof URL ? fileURLToPath(path) : path);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      throw new errors.NotFound(
        `No such file or directory (os error 2), chdir '${path}'`,
      );
    }
    throw mapError(error);
  }
};
