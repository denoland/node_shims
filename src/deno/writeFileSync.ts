///<reference path="../lib.deno.d.ts" />

import { writeFileSync as nodeWriteFileSync } from "fs";

export const writeFileSync: typeof Deno.writeFileSync = function writeFileSync(
  path,
  data,
  { append = false, create = true, mode = 0o666 } = {},
) {
  nodeWriteFileSync(path, data, {
    flag: append ? create ? "a" : "ax" : create ? "w" : "wx",
    mode,
  });
};
