///<reference path="../lib.deno.d.ts" />

export const version: typeof Deno.version = {
  deno: "1.12.0",
  typescript: "4.3.5",
  v8: process.versions.v8,
};
