///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const copyFileSync: typeof Deno.copyFileSync = fs.copyFileSync;
