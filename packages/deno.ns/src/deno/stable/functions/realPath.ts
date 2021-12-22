///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";

export const realPath: typeof Deno.realPath = fs.realpath;
