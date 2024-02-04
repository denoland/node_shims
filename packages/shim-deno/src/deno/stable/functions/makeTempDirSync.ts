///<reference path="../lib.deno.d.ts" />

import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

export const makeTempDirSync: typeof Deno.makeTempDirSync =
  function makeTempDirSync(
    { prefix = "" } = {},
  ) {
    return mkdtempSync(join(tmpdir(), prefix || "/"));
  };
