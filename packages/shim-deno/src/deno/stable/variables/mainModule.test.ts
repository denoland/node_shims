import assert from "assert/strict";
import { fileURLToPath, pathToFileURL } from "url";
import { join, resolve } from "path";

import { mainModule } from "./mainModule.js";

Deno.test("should get entrypoint", () => {
  const path = resolve(
    join(fileURLToPath(import.meta.url), "../../../../../tools/run_tests.mjs"),
  );
  assert.equal(mainModule, pathToFileURL(path).toString());
});
