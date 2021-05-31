///<reference path="../lib.deno.d.ts" />

import { fdatasyncSync as nodefdatasyncSync } from "fs";

export const fdatasyncSync: typeof Deno.fdatasyncSync = nodefdatasyncSync;
