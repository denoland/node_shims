///<reference path="../lib.deno.d.ts" />

import { fileURLToPath } from "url";

export const chdir: typeof Deno.chdir = function (path: string | URL) {
  return process.chdir(path instanceof URL ? fileURLToPath(path) : path);
};
