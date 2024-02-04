///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";

export const realPathSync: typeof Deno.realPathSync = fs.realpathSync;
