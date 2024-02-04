///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";

export const close: typeof Deno.close = fs.closeSync;
