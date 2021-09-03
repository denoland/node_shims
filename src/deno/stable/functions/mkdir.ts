///<reference path="../lib.deno.d.ts" />

import { mkdir as nodeMkdir } from "fs/promises";
import mapError from "../../internal/errorMap.js";

export const mkdir: typeof Deno.mkdir = async function mkdir(p, o) {
  try {
    await nodeMkdir(p, o);
  } catch (error) {
    throw mapError(error);
  }
};
