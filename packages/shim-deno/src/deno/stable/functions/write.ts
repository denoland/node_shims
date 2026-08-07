///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import { promisify } from "util";

import { appends, positions } from "./seekSync.js";

const nodeWrite = promisify(fs.write);

export const write: typeof Deno.write = async (fd, data) => {
  const position = positions.get(fd) ?? null;
  const { bytesWritten } = await nodeWrite(
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
