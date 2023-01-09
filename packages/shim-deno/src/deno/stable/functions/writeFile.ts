///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";
import mapError from "../../internal/errorMap.js";
import { getFsFlag } from "../../internal/fs_flags.js";

export const writeFile: typeof Deno.writeFile = async function writeFile(
  path,
  data,
  { append = false, create = true, createNew = false, mode, signal } = {},
) {
  const truncate = create && !append;
  const flag = getFsFlag({ append, create, createNew, truncate, write: true });
  try {
    await fs.writeFile(path, data, { flag, signal });
    if (mode != null) await fs.chmod(path, mode);
  } catch (error) {
    throw mapError(error);
  }
};
