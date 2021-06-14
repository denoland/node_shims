///<reference path="../lib.deno.d.ts" />

import { openSync as nodeOpenSync } from "fs";

import { File } from "../classes/File";
import { getFsFlag } from "../../internal/fs_flags";

export const openSync: typeof Deno.openSync = function openSync(
  path,
  { read = true, write, append, truncate, create, createNew, mode } = {}
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
