///<reference path="../lib.deno.d.ts" />

import { writeFile } from "fs/promises";

export const writeTextFile: typeof Deno.writeTextFile = function writeTextFile(
  path,
  data,
) {
  return writeFile(path, data);
};
