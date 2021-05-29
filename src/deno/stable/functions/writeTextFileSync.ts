///<reference path="../lib.deno.d.ts" />

import { writeFileSync } from "fs";

export const writeTextFileSync: typeof Deno.writeTextFileSync = writeFileSync;
