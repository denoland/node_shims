/// <reference path="../lib.deno.d.ts" />

import { release } from "os";

export const osRelease: typeof Deno.osRelease = function osRelease() {
  return release();
};
