///<reference path="../lib.deno.d.ts" />

import { fdatasyncSync as nodefdatasyncSync } from "node:fs";

export const fdatasyncSync: typeof Deno.fdatasyncSync = nodefdatasyncSync;
