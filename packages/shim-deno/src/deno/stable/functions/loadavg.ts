/// <reference path="../lib.deno.d.ts" />

import * as os from "node:os";

export const loadavg: typeof Deno.loadavg = function loadavg() {
  return os.loadavg();
};
