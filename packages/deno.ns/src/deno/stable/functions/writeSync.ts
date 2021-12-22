///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const writeSync: typeof Deno.writeSync = fs.writeSync;
