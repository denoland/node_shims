/// <reference path="../lib.deno.d.ts" />

import * as os from "node:os";

export const hostname: typeof Deno.hostname = function hostname() {
  return os.hostname();
};
