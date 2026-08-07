///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

import { appends, positions } from "./seekSync.js";

export const readSync: typeof Deno.readSync = (fd, buffer) => {
  const position = positions.get(fd) ?? null;
  const bytesRead = fs.readSync(
    fd,
    buffer,
    0,
    buffer.length,
    appends.has(fd) ? null : position,
  );
  if (position !== null) {
    positions.set(fd, position + bytesRead);
  }
  // node returns 0 on EOF, Deno expects null
  return bytesRead === 0 ? null : bytesRead;
};
