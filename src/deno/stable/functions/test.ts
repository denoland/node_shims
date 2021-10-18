///<reference path="../lib.deno.d.ts" />

export let test: typeof Deno.test;

try {
  test = require("@fromdeno/test").test;
} catch {
  test = () => {};
}

import type { AssertTrue, IsExact } from "conditional-type-checks";
type _TypeTest = AssertTrue<
  IsExact<typeof import("@fromdeno/test").test, typeof Deno.test>
>;
