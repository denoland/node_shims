///<reference path="../lib.deno.d.ts" />

import { mkdtemp } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";

export const makeTempDir: typeof Deno.makeTempDir = function makeTempDir(
  { prefix = "" } = {},
) {
  return mkdtemp(join(tmpdir(), prefix || "/"));
};
