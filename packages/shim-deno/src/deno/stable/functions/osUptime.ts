/// <reference path="../lib.deno.d.ts" />

import { uptime } from "os";

export const osUptime: typeof Deno.osUptime = function osUptime() {
  return uptime();
};
