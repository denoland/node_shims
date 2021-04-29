///<reference path="../lib.deno.d.ts" />

import { open as node_open } from "fs/promises";

export const open: typeof Deno.open = async function open(
  path,
  options = { read: true },
) {
  const flags = options.append
    ? "a"
    : options.write
    ? options.create ? "w" : "r+"
    : options.read
    ? "r"
    : "?";
  const f = await node_open(path, flags);
  let position = 0;
  const file: Deno.File = {
    rid: 0,
    close() {
      f.close();
    },
    async read(p) {
      const { bytesRead } = await f.read(p, 0, p.byteLength, position);
      if (bytesRead === 0) {
        return null;
      }
      return (position += bytesRead);
    },
    readSync(p) {
      throw new Error("readSync not implemented");
    },
    async seek(offset, whence) {
      if (whence === 0) {
        position = offset;
      } else if (whence === 1) {
        position += offset;
      } else {
        throw new Error("Deno.SeekMode.End not implemented");
      }
      return position;
    },
    seekSync(offset, whence) {
      throw new Error("seekSync not implemented");
    },
    async stat() {
      const s = await f.stat();
      const stats: Deno.FileInfo = {
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
      return stats;
    },
    statSync() {
      throw new Error("statSync not implemented");
    },
    truncate() {
      throw new Error("truncate not implemented");
    },
    truncateSync() {
      throw new Error("truncateSync not implemented");
    },
    async write(p) {
      return (position += (await f.write(p, 0, p.byteLength, position))
        .bytesWritten);
    },
    writeSync() {
      throw new Error("writeSync not implemented");
    },
  };
  return file;
};
