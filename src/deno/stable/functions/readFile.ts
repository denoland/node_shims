///<reference path="../lib.deno.d.ts" />

import { readFile as nodeReadFile } from "fs/promises";

export const readFile: typeof Deno.readFile = function readFile(path) {
  return nodeReadFile(path);
};
