///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";

export const linkSync: typeof Deno.linkSync = fs.linkSync;
