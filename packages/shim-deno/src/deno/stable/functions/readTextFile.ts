///<reference path="../lib.deno.d.ts" />

import { readFile } from "node:fs/promises";
import mapError from "../../internal/errorMap.js";

export const readTextFile: typeof Deno.readTextFile = async (
  path,
  { signal } = {},
) => {
  try {
    return await readFile(path, { encoding: "utf8", signal });
  } catch (e) {
    throw mapError(e);
  }
};
