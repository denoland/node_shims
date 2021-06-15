///<reference path="../lib.deno.d.ts" />

import { open as nodeOpen } from "fs/promises";

import { File } from "../classes/File";
import { getFsFlag } from "../../internal/fs_flags";

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
  const f = await nodeOpen(path, flagMode, mode);
  return new File(f.fd);
};
