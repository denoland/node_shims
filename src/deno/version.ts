///<reference path="../lib.deno.d.ts" />

export const version: typeof Deno.version = {
  deno: "1.10.2",
  typescript: "4.2.2",
  v8: process.versions.v8,
};
