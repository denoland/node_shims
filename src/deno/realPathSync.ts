///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const realPathSync: typeof Deno.realPathSync = fs.realpathSync;
