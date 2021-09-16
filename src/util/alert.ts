///<reference path="../deno/stable/lib.deno.d.ts" />

import { writeSync } from "fs";
import { readlineSync } from "./readlineSync.js";

export const alert: typeof globalThis.alert = function alert(message) {
  writeSync(process.stdout.fd, new TextEncoder().encode(`${message} [Enter] `));
  readlineSync();
};
