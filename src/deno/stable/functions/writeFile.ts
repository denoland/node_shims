///<reference path="../lib.deno.d.ts" />

import { open } from "./open";
import mapError from "../../internal/errorMap";

export const writeFile: typeof Deno.writeFile = async function writeFile(
  path,
  data,
  { append = false, create = true, mode = 0o666 } = {}
) {
  try {
    const file = await open(path, { write: true, append, create, mode });
    file.writeSync(data);
    file.close();
  } catch (e) {
    throw mapError(e);
  }
};
