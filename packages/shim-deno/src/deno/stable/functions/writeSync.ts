///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";

export const writeSync: typeof Deno.writeSync = fs.writeSync;
