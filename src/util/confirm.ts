///<reference path="../deno/stable/lib.deno.d.ts" />

import { writeSync } from "fs";
import { readlineSync } from "./readlineSync.js";

export const confirm: typeof globalThis.confirm = function confirm(message) {
  writeSync(process.stdout.fd, new TextEncoder().encode(`${message} [y/N] `));
  const result = readlineSync();
  return ["y", "Y"].includes(result);
};
