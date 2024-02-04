///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";

export const symlinkSync: typeof Deno.symlinkSync = (
  oldpath,
  newpath,
  options?,
) => fs.symlinkSync(oldpath, newpath, options?.type);
