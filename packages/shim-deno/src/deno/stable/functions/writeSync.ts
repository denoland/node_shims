///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

import { appends, positions } from "./seekSync.js";

export const writeSync: typeof Deno.writeSync = (fd, data) => {
  const position = positions.get(fd) ?? null;
  const bytesWritten = fs.writeSync(
    fd,
    data,
    0,
    data.length,
    appends.has(fd) ? null : position,
  );
  if (position !== null) {
    positions.set(fd, position + bytesWritten);
  }
  return bytesWritten;
};
