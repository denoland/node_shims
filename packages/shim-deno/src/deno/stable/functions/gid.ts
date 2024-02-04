/// <reference path="../lib.deno.d.ts" />

import ps from "process";

export const gid: typeof Deno.gid = ps.getgid ?? (() => null);
