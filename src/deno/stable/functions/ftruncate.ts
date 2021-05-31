///<reference path="../lib.deno.d.ts" />

import { ftruncate as nodeftruncate } from "fs";
import { promisify } from "util";

const _ftruncate = promisify(nodeftruncate);

export const ftruncate: typeof Deno.ftruncate = async function ftruncate(
  rid,
  len,
) {
  await _ftruncate(rid, len);
};
