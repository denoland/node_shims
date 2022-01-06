import { setInterval, setTimeout } from "./index";
import * as assert from "assert";

console.log("should get setTimeout result that's a number...");
const timeoutId = setTimeout(() => {}, 100);
assert.strictEqual("number", typeof timeoutId);
clearTimeout(timeoutId);

console.log("should get setInterval result that's a number");
const intervalId = setInterval(() => {}, 100);
assert.strictEqual("number", typeof intervalId);
clearInterval(intervalId);
