///<reference path="../lib.deno.d.ts" />

import { fstat } from "fs";
import { promisify } from "util";

import { positions } from "./seekSync.js";

const nodeFstat = promisify(fstat);

export const seek: typeof Deno.seek = async function (fd, offset, whence) {
  let p = positions.get(fd);
  if (p == null) {
    throw new Error("Bad file descriptor");
  }
  switch (whence) {
    case Deno.SeekMode.Start:
      p = Number(offset);
      break;
    case Deno.SeekMode.Current:
      p += Number(offset);
      break;
    case Deno.SeekMode.End:
      p = (await nodeFstat(fd)).size + Number(offset);
      break;
    default:
      throw new TypeError(`Invalid seek mode: ${whence}`);
  }
  positions.set(fd, p!);
  return p!;
};
