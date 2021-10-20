/// <reference path="../lib.deno.d.ts" />

import { testDefinitions } from "../../internal/test.js";

export const test: typeof Deno.test = function test() {
  let testDef: Deno.TestDefinition;
  const firstArg = arguments[0];
  const secondArg = arguments[1];

  if (typeof firstArg === "string") {
    if (typeof secondArg !== "function") {
      throw new TypeError("Missing test function");
    }
    testDef = { name: firstArg, fn: secondArg };
  } else {
    if (!firstArg?.fn) {
      throw new TypeError("Missing test function");
    }
    testDef = { ...firstArg };
  }

  if ((testDef.name?.length ?? 0) === 0) {
    throw new TypeError("The test name can't be empty");
  }

  testDefinitions.push(testDef);
};
