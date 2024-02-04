///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import { promisify } from "util";

const nodeWrite = promisify(fs.write);

export const write: typeof Deno.write = async (fd, data) => {
  const { bytesWritten } = await nodeWrite(fd, data);
  return bytesWritten;
};
