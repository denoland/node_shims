///<reference path="../lib.deno.d.ts" />

import { writeFile as nodeWriteFile } from "fs/promises";

export const writeFile: typeof Deno.writeFile = async function writeFile(
  path,
  data,
  options = {},
) {
  await nodeWriteFile(path, data, {
    flag: options.append
      ? "a"
      : ("create" in options && !options.create)
      ? "wx"
      : "w",
    mode: options.mode,
  });
};
