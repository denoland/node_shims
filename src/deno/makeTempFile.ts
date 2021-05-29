///<reference path="../lib.deno.d.ts" />

import { writeTextFile } from "./writeTextFile";
import { join } from "path";
import { tmpdir } from "os";
import { randomId } from "./internal/random_id";

export const makeTempFile: typeof Deno.makeTempFile =
  async function makeTempFile(
    { prefix = "" } = {},
  ) {
    const name = join(tmpdir(), prefix, randomId());
    await writeTextFile(name, "");
    return name;
  };
