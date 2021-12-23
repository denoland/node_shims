///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";
import mapError from "../../internal/errorMap.js";
import { getFsFlag } from "../../internal/fs_flags.js";

export const writeTextFile: typeof Deno.writeTextFile =
  async function writeTextFile(
    path,
    data,
    { append = false, create = true, mode, signal } = {},
  ) {
    const truncate = create && !append;
    const flag = getFsFlag({ append, create, truncate, write: true });
    try {
      await fs.writeFile(path, data, { flag, mode, signal });
      if (mode !== undefined) await fs.chmod(path, mode);
    } catch (error) {
      throw mapError(error);
    }
  };
