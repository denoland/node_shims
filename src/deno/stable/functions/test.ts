///<reference path="../lib.deno.d.ts" />

export const tests: Deno.TestDefinition[] = [];

export const test: typeof Deno.test = function test(
  name: string | Deno.TestDefinition,
  fn?: () => void | Promise<void>,
) {
  tests.push(typeof name === "string" ? { name, fn: fn! } : name);
};
