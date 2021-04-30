///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const chownSync: typeof Deno.chownSync = fs.chownSync;
