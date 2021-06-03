///<reference path="../deno/stable/lib.deno.d.ts" />

import "../global.js";

// without the eval, import() will be replaced with require() by TypeScript
Promise.all(Deno.args.map((arg) => eval(`import("${arg}")`))).then(async () => {
  // @ts-expect-error __tests is untyped
  const tests: (() => Promise<void>)[] = Deno.test.__tests;

  for (const test of tests) {
    await test();
  }
});
