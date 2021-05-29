///<reference path="../lib.deno.d.ts" />

import { writeFile as nodeWriteFile } from "fs/promises";

export const writeFile: typeof Deno.writeFile = async function writeFile(
  path,
  data,
  { append = false, create = true, mode = 0o666 } = {},
) {
  await nodeWriteFile(path, data, {
    flag: append ? create ? "a" : "ax" : create ? "w" : "wx",
    mode,
  });
};
