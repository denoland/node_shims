///<reference path="../lib.deno.d.ts" />

import { openSync as nodeOpenSync } from "fs";

import { File } from "../classes/FsFile.js";
import { getFsFlag } from "../../internal/fs_flags.js";

export const openSync: typeof Deno.openSync = function openSync(
  path,
  { read, write, append, truncate, create, createNew, mode = 0o666 } = {
    read: true,
  },
) {
  const flagMode = getFsFlag({
    read,
    write,
    append,
    truncate,
    create,
    createNew,
  });
  const fd = nodeOpenSync(path, flagMode, mode);
  return new File(fd);
};
