///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";

export const symlink: typeof Deno.symlink = async (
  oldpath,
  newpath,
  options?,
) => await fs.symlink(oldpath, newpath, options?.type);
