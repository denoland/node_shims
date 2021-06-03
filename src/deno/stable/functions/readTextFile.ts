///<reference path="../lib.deno.d.ts" />

import { readFile } from "fs/promises";
import mapError from "../../internal/errorMap";

export const readTextFile: typeof Deno.readTextFile = function readTextFile(
  path
) {
  try {
    return readFile(path, "utf8");
  } catch (e) {
    throw mapError(e);
  }
};
