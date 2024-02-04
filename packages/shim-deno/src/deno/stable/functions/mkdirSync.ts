///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";
import mapError from "../../internal/errorMap.js";
import { errors } from "../variables.js";

export const mkdirSync: typeof Deno.mkdirSync = (path, options) => {
  try {
    fs.mkdirSync(path, options);
  } catch (error: any) {
    if (error?.code === "EEXIST") {
      throw new errors.AlreadyExists(
        `File exists (os error 17), mkdir '${path}'`,
      );
    }
    throw mapError(error);
  }
};
