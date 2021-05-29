///<reference path="../lib.deno.d.ts" />

import { promisify } from "util";
import { read as nodeRead } from "fs";

const _read = promisify(nodeRead);

export const read: typeof Deno.read = function read(rid, buffer) {
  return _read(rid, buffer, 0, buffer.length, null).then((r) => r.bytesRead);
};
