///<reference path="../lib.deno.d.ts" />

import { mkdtempSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

export const makeTempDirSync: typeof Deno.makeTempDirSync =
  function makeTempDirSync(
    { prefix = "" } = {},
  ) {
    return mkdtempSync(join(tmpdir(), prefix || "/"));
  };
