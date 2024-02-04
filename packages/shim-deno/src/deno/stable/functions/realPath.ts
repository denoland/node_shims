///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs/promises";

export const realPath: typeof Deno.realPath = fs.realpath;
