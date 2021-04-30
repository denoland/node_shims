///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const truncateSync: typeof Deno.truncateSync = fs.truncateSync;
