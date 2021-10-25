///<reference path="../lib.deno.d.ts" />

import which from "which";

export const execPath: typeof Deno.execPath = () => which.sync("deno");
