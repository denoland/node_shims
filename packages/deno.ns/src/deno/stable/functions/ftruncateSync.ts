///<reference path="../lib.deno.d.ts" />

import { ftruncateSync as nodeftruncateSync } from "fs";

export const ftruncateSync: typeof Deno.ftruncateSync = nodeftruncateSync;
