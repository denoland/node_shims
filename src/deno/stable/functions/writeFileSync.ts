///<reference path="../lib.deno.d.ts" />

import { openSync } from "./openSync";
import mapError from "../../internal/errorMap";

export const writeFileSync: typeof Deno.writeFileSync = function writeFileSync(
  path,
  data,
  { append = false, create = true, mode = 0o666 } = {}
) {
  try {
    const file = openSync(path, { write: true, append, create, mode });
    file.writeSync(data);
    file.close();
  } catch (e) {
    throw mapError(e);
  }
};
