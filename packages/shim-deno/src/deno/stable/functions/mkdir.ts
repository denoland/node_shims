///<reference path="../lib.deno.d.ts" />

import { mkdir as nodeMkdir } from "node:fs/promises";
import mapError from "../../internal/errorMap.js";
import { errors } from "../variables.js";

export const mkdir: typeof Deno.mkdir = async function mkdir(path, options) {
  try {
    await nodeMkdir(path, options);
  } catch (error: any) {
    if (error?.code === "EEXIST") {
      throw new errors.AlreadyExists(
        `File exists (os error 17), mkdir '${path}'`,
      );
    }
    throw mapError(error);
  }
};
