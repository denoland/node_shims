///<reference path="../lib.deno.d.ts" />

import { readFile as nodeReadFile } from "fs/promises";
import mapError from "../../internal/errorMap.js";

export const readFile: typeof Deno.readFile = async function readFile(
  path,
  { signal } = {},
) {
  try {
    const buf = await nodeReadFile(path, { signal });
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
  } catch (e) {
    throw mapError(e);
  }
};
