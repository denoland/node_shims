/// <reference path="../lib.deno.d.ts" />

import ps from "node:process";

export const gid: typeof Deno.gid = ps.getgid ?? (() => null);
