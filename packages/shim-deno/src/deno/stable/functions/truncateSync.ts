///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";

import mapError from "../../internal/errorMap.js";
import { errors } from "../variables.js";

export const truncateSync: typeof Deno.truncateSync = (name, len) => {
  try {
    return fs.truncateSync(name, len);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      throw new errors.NotFound(
        `No such file or directory (os error 2), truncate '${name}'`,
      );
    }
    throw mapError(error);
  }
};
