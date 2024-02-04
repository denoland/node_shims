///<reference path="../lib.deno.d.ts" />

import { stat as nodeStat } from "fs/promises";
import type { Stats } from "fs";
import * as os from "os";
import mapError from "../../internal/errorMap.js";

const isWindows = os.platform() === "win32";

export function denoifyFileInfo(s: Stats): Deno.FileInfo {
  return {
    atime: s.atime,
    birthtime: s.birthtime,
    blksize: isWindows ? null : s.blksize,
    blocks: isWindows ? null : s.blocks,
    dev: s.dev,
    gid: isWindows ? null : s.gid,
    ino: isWindows ? null : s.ino,
    isDirectory: s.isDirectory(),
    isFile: s.isFile(),
    isSymlink: s.isSymbolicLink(),
    isBlockDevice: isWindows ? null : s.isBlockDevice(),
    isCharDevice: isWindows ? null : s.isCharacterDevice(),
    isFifo: isWindows ? null : s.isFIFO(),
    isSocket: isWindows ? null : s.isSocket(),
    mode: isWindows ? null : s.mode,
    mtime: s.mtime,
    nlink: isWindows ? null : s.nlink,
    rdev: isWindows ? null : s.rdev,
    size: s.size,
    uid: isWindows ? null : s.uid,
  };
}

export const stat: typeof Deno.stat = async (path) => {
  try {
    return denoifyFileInfo(await nodeStat(path));
  } catch (e) {
    throw mapError(e);
  }
};
