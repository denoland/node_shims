///<reference path="../lib.deno.d.ts" />

import * as os from "node:os";

export const build: typeof Deno.build = {
  arch: "x86_64",
  os: ((p) => p === "win32" ? "windows" : p === "darwin" ? "darwin" : "linux")(
    os.platform(),
  ),
  vendor: "pc",
  target:
    ((p) =>
      p === "win32"
        ? "x86_64-pc-windows-msvc"
        : p === "darwin"
        ? "x86_64-apple-darwin"
        : "x86_64-unknown-linux-gnu")(os.platform()),
};
