///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";

export const copyFile: typeof Deno.copyFile = fs.copyFile;
