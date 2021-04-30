///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const linkSync: typeof Deno.linkSync = fs.linkSync;
