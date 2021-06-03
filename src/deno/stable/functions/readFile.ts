///<reference path="../lib.deno.d.ts" />

import { readFile as nodeReadFile } from "fs/promises";
import mapError from "../../internal/errorMap.js";

export const readFile: typeof Deno.readFile = function readFile(path) {
  try {
    return nodeReadFile(path);
  } catch (e) {
    throw mapError(e);
  }
};
