///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const chmodSync: typeof Deno.chmodSync = fs.chmodSync;
