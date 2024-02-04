///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const renameSync: typeof Deno.renameSync = fs.renameSync;
