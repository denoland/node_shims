/// <reference path="../lib.deno.d.ts" />

import os from "node:os";
import ps from "node:process";

export const kill: typeof Deno.kill = function (pid, signo) {
  if (pid < 0 && os.platform() === "win32") {
    throw new TypeError("Invalid pid");
  }
  ps.kill(pid, signo);
};
