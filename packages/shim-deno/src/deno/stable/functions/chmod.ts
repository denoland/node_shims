///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";

export const chmod: typeof Deno.chmod = fs.chmod;
