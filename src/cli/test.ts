///<reference path="../deno/stable/lib.deno.d.ts" />

import { platform } from "os";
import { join } from "path";
import "../global.js";

const proto = "file://" + (platform() === "win32" ? "/" : "");

Promise.all(Deno.args.map((arg) =>
  eval(
    `import("${proto}${join(process.cwd(), arg).replaceAll("\\", "/")}.js")`,
  )
)).then(async () => {
  // @ts-expect-error __tests is untyped
  const tests: (() => Promise<void>)[] = Deno.test.__tests;

  for (const test of tests) {
    await test();
  }
});
