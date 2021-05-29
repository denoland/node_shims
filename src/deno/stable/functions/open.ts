///<reference path="../lib.deno.d.ts" />

import { open as nodeOpen } from "fs/promises";

import { File } from "../classes/File";

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
  const f = await nodeOpen(path, flags);
  return new File(f.fd);
};
