///<reference path="../lib.deno.d.ts" />

import { fstatSync } from "fs";

export const appends = new Set<number>();
export const positions = new Map<number, number>();

export const seekSync: typeof Deno.seekSync = function (fd, offset, whence) {
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
      p = fstatSync(fd).size + Number(offset);
      break;
    default:
      throw new TypeError(`Invalid seek mode: ${whence}`);
  }
  positions.set(fd, p!);
  return p!;
};
