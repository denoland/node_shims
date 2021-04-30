///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const mkdirSync: typeof Deno.mkdirSync = fs.mkdirSync;
