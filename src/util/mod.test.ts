import { setInterval, setTimeout } from "./mod.js";
import assert from "assert/strict";

Deno.test("should get setTimeout result that's a number", () => {
  const timeoutId = setTimeout(() => {}, 100);
  assert.equal("number", typeof timeoutId);
  clearTimeout(timeoutId);
});

Deno.test("should get setInterval result that's a number", () => {
  const intervalId = setInterval(() => {}, 100);
  assert.equal("number", typeof intervalId);
  clearInterval(intervalId);
});
