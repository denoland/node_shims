///<reference path="../lib.deno.d.ts" />

import { openSync as nodeOpenSync } from "fs";
import { File } from "../classes/File.js";

export const openSync: typeof Deno.openSync = function openSync(
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
  const fd = nodeOpenSync(path, flags);
  return new File(fd);
};
