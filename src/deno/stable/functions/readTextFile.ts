///<reference path="../lib.deno.d.ts" />

import { readFile } from "fs/promises";
import mapError from "../../internal/errorMap.js";

export const readTextFile: typeof Deno.readTextFile = function readTextFile(
  path,
  { signal } = {},
) {
  try {
    return readFile(path, { encoding: "utf8", signal });
  } catch (e) {
    throw mapError(e);
  }
};
