///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";

export const truncate: typeof Deno.truncate = fs.truncate;
