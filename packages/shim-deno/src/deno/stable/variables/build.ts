///<reference path="../lib.deno.d.ts" />

import * as os from "os";

const arch = process.arch === "arm64" ? "aarch64" : "x86_64";
export const build: typeof Deno.build = {
  arch,
  os: ((p) => p === "win32" ? "windows" : p === "darwin" ? "darwin" : "linux")(
    os.platform(),
  ),
  vendor: "pc",
  target:
    ((p) =>
      p === "win32"
        ? `${arch}-pc-windows-msvc`
        : p === "darwin"
        ? `${arch}-apple-darwin`
        : `${arch}-unknown-linux-gnu`)(os.platform()),
};
