///<reference path="../lib.deno.d.ts" />

import { stat as nodeStat } from "fs/promises";
import type { Stats } from "fs";

export function denoifyFileInfo(s: Stats): Deno.FileInfo {
  return {
    atime: s.atime,
    birthtime: s.birthtime,
    blksize: s.blksize,
    blocks: s.blocks,
    dev: s.dev,
    gid: s.gid,
    ino: s.ino,
    isDirectory: s.isDirectory(),
    isFile: s.isFile(),
    isSymlink: s.isSymbolicLink(),
    mode: s.mode,
    mtime: s.mtime,
    nlink: s.nlink,
    rdev: s.rdev,
    size: s.size,
    uid: s.uid,
  };
}

export const stat: typeof Deno.stat = async (path) =>
  denoifyFileInfo(await nodeStat(path));
