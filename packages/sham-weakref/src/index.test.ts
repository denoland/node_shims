import { WeakRef } from "./index";
import * as assert from "assert/strict";

if (globalThis.WeakRef != null) {
  console.log("should store a value in the WeakRef...");
  const value = new WeakRef({ value: 5 });
  assert.equal(value.deref().value, 5);
} else {
  console.log("should throw when getting a value from the WeakRef...");
  const value = new WeakRef({ value: 5 });
  assert.throws(() => value.deref().value);
}
