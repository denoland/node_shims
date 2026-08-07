///<reference path="../lib.deno.d.ts" />

import { promisify } from "util";
import { read as nodeRead } from "fs";

import { appends, positions } from "./seekSync.js";

const _read = promisify(nodeRead);

export const read: typeof Deno.read = async function read(rid, buffer) {
  if (buffer == null) {
    throw new TypeError("Buffer must not be null.");
  }
  if (buffer.length === 0) {
    return 0;
  }

  const position = positions.get(rid) ?? null;
  const { bytesRead } = await _read(
    rid,
    buffer,
    0,
    buffer.length,
    appends.has(rid) ? null : position,
  );
  if (position !== null) {
    positions.set(rid, position + bytesRead);
  }
  // node returns 0 on EOF, Deno expects null
  return bytesRead === 0 ? null : bytesRead;
};
