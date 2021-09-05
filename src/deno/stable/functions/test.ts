///<reference path="../lib.deno.d.ts" />

export { test, tests } from "@fromdeno/test";
import type { AssertTrue, IsExact } from "conditional-type-checks";
type _TypeTest = AssertTrue<
  IsExact<typeof import("@fromdeno/test").test, typeof Deno.test>
>;
