///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const symlinkSync: typeof Deno.symlinkSync = (
  oldpath,
  newpath,
  options?,
) => fs.symlinkSync(oldpath, newpath, options?.type);
