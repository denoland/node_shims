///<reference path="../lib.deno.d.ts" />

import { open as _open } from "fs";
import { promisify } from "util";

import { File } from "../classes/File";
import { getFsFlag } from "../../internal/fs_flags";

const nodeOpen = promisify(_open);

export const open: typeof Deno.open = async function open(
  path,
  { read = true, write, append, truncate, create, createNew, mode = 0o666 } = {}
) {
  const flagMode = getFsFlag({
    read,
    write,
    append,
    truncate,
    create,
    createNew,
  });
  const fd = await nodeOpen(path, flagMode, mode);
  return new File(fd);
};
