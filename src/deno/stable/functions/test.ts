///<reference path="../lib.deno.d.ts" />

export const tests: Required<Deno.TestDefinition>[] = [];

export const test: typeof Deno.test = function test(
  t: string | Deno.TestDefinition,
  fn?: () => void | Promise<void>,
) {
  const defaults = {
    ignore: false,
    only: false,
    sanitizeOps: true,
    sanitizeResources: true,
    sanitizeExit: true,
    permissions: null,
  };

  if (typeof t === "string") {
    if (typeof fn !== "function") {
      throw new TypeError("Missing test function");
    }
    if (!t) {
      throw new TypeError("The test name can't be empty");
    }
    tests.push({ fn: fn, name: t, ...defaults });
  } else {
    if (!t.fn) {
      throw new TypeError("Missing test function");
    }
    if (!t.name) {
      throw new TypeError("The test name can't be empty");
    }
    tests.push({ ...defaults, ...t });
  }
};
