import assert from "assert/strict";
import { run } from "./run.js";

Deno.test("error when cwd doesn't exist", () => {
  assert.throws(() => {
    run({
      cmd: ["echo"],
      cwd: "non-existent-directory",
    });
  }, { message: "The directory name is invalid." });
});
