///<reference path="../lib.deno.d.ts" />

import { writeTextFileSync } from "./writeTextFileSync";
import { join } from "path";
import { tmpdir } from "os";
import { randomId } from "../../internal/random_id";

export const makeTempFileSync: typeof Deno.makeTempFileSync =
  function makeTempFileSync(
    { prefix = "" } = {},
  ) {
    const name = join(tmpdir(), prefix, randomId());
    writeTextFileSync(name, "");
    return name;
  };
