///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";

export const chown: typeof Deno.chown = fs.chown;
