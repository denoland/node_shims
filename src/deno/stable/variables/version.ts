///<reference path="../lib.deno.d.ts" />

import { deno, typescript } from "../../internal/version.js";

export const version: typeof Deno.version = {
  deno,
  typescript,
  v8: process.versions.v8,
};
