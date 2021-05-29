// <source path=https://deno.land/std@0.97.0/io/util.ts />
///<reference path="../../../lib.deno.d.ts" />

import { DEFAULT_BUFFER_SIZE } from "../../internal/consts";

export async function* iter(
  r: Deno.Reader,
  options?: {
    bufSize?: number;
  },
): AsyncIterableIterator<Uint8Array> {
  const bufSize = options?.bufSize ?? DEFAULT_BUFFER_SIZE;
  const b = new Uint8Array(bufSize);
  while (true) {
    const result = await r.read(b);
    if (result === null) {
      break;
    }

    yield b.subarray(0, result);
  }
}
