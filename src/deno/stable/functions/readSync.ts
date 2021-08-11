///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const readSync: typeof Deno.readSync = (fd, buffer) => {
  const bytesRead = fs.readSync(fd, buffer);
  // node returns 0 on EOF, Deno expects null
  return bytesRead === 0 ? null : bytesRead;
};
