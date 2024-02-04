///<reference path="../lib.deno.d.ts" />

import { promisify } from "node:util";
import { read as nodeRead } from "node:fs";

const _read = promisify(nodeRead);

export const read: typeof Deno.read = async function read(rid, buffer) {
  if (buffer == null) {
    throw new TypeError("Buffer must not be null.");
  }
  if (buffer.length === 0) {
    return 0;
  }

  const { bytesRead } = await _read(rid, buffer, 0, buffer.length, null);
  // node returns 0 on EOF, Deno expects null
  return bytesRead === 0 ? null : bytesRead;
};
