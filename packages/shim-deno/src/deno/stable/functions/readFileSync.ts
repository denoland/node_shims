///<reference path="../lib.deno.d.ts" />

import { readFileSync as nodeReadFile } from "node:fs";
import mapError from "../../internal/errorMap.js";

export const readFileSync: typeof Deno.readFileSync = function readFileSync(
  path,
) {
  try {
    const buf = nodeReadFile(path);
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
  } catch (e) {
    throw mapError(e);
  }
};
