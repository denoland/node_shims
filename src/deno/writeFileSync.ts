///<reference path="../lib.deno.d.ts" />

import { writeFileSync as nodeWriteFileSync } from "fs";

export const writeFileSync: typeof Deno.writeFileSync = function writeFileSync(
  path,
  data,
  options = {},
) {
  nodeWriteFileSync(path, data, {
    flag: options.append
      ? "a"
      : ("create" in options && !options.create)
      ? "wx"
      : "w",
    mode: options.mode,
  });
};
