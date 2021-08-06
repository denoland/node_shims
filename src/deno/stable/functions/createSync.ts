///<reference path="../lib.deno.d.ts" />

import { openSync } from "./openSync.js";

export const createSync: typeof Deno.createSync = function createSync(path) {
  return openSync(path, { create: true, truncate: true });
};
