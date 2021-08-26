///<reference path="../lib.deno.d.ts" />

import { readFile as nodeReadFile } from "fs/promises";
import mapError from "../../internal/errorMap.js";

export const readFile: typeof Deno.readFile = async function readFile(
  path,
  { signal } = {},
) {
  try {
    return await nodeReadFile(path, { signal });
  } catch (e) {
    throw mapError(e);
  }
};
