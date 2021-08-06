///<reference path="../lib.deno.d.ts" />

import { iter } from "../../std/io/util.js";

export const copy: typeof Deno.copy = async (
  src,
  dst,
  { bufSize = undefined } = {},
) => {
  let bytes = 0;

  for await (const chunk of iter(src, { bufSize })) {
    bytes += await dst.write(chunk);
  }

  return bytes;
};
