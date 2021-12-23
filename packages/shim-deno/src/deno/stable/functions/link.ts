///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";

export const link: typeof Deno.link = fs.link;
