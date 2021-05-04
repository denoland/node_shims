///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";

export const chown: typeof Deno.chown = async (path, uid, gid) =>
  await fs.chown(path, uid ?? -1, gid ?? -1);
