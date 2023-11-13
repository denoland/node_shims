/// <reference path="../lib.deno.d.ts" />

import ps from "process";

export const uid: typeof Deno.uid = ps.getuid ?? (() => null);
