///<reference path="../lib.deno.d.ts" />

import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

export const makeTempDir: typeof Deno.makeTempDir = function makeTempDir(
  { prefix = "" } = {},
) {
  return mkdtemp(join(tmpdir(), prefix || "/"));
};
