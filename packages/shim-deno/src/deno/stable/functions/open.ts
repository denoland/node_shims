///<reference path="../lib.deno.d.ts" />

import { open as _open } from "fs";
import { promisify } from "util";

import { File } from "../classes/FsFile.js";
import { getFsFlag } from "../../internal/fs_flags.js";
import mapError from "../../internal/errorMap.js";

const nodeOpen = promisify(_open);

export const open: typeof Deno.open = async function open(
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
  try {
    const fd = await nodeOpen(path, flagMode, mode);
    return new File(fd);
  } catch (err) {
    throw mapError(err);
  }
};
