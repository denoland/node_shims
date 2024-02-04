///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const close: typeof Deno.close = fs.closeSync;
