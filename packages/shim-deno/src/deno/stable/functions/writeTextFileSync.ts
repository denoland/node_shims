///<reference path="../lib.deno.d.ts" />

import * as fs from "node:fs";
import mapError from "../../internal/errorMap.js";

export const writeTextFileSync: typeof Deno.writeTextFileSync = (
  path,
  data,
  { append = false, create = true, mode } = {},
) => {
  const flag = create ? (append ? "a" : "w") : "r+";
  try {
    fs.writeFileSync(path, data, { flag, mode });
    if (mode !== undefined) fs.chmodSync(path, mode);
  } catch (error) {
    throw mapError(error);
  }
};
