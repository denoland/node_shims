///<reference path="../lib.deno.d.ts" />

import { join } from "path";
import "../global.js";

let p = Promise.resolve();

const test: typeof Deno.test = function test(
  name: Parameters<typeof Deno.test>[0],
  fn: Parameters<typeof Deno.test>[1],
) {
  const t = typeof name === "string" ? { name, fn } : name;
  p = p.then(
    (async () => {
      const start = Date.now();
      try {
        await t.fn();
      } catch (err) {
        console.log(`test ${t.name} ... FAILED (${Date.now() - start}ms)`);
        console.log(`\t${err.message}`);
        return;
      }
      console.log(`test ${t.name} ... ok (${Date.now() - start}ms)`);
    }),
  );
} as typeof Deno.test;

// Assignment is disallowed, so we use Object.defineProperty
Object.defineProperty(Deno, "test", { value: test });

Deno.args.forEach((arg) =>
  eval(
    'import("' +
      `file:///${join(process.cwd(), arg).replaceAll("\\", "/")}.js` +
      '")',
  )
);
