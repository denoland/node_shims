///<reference path="../lib.deno.d.ts" />

import { writeFile } from "fs/promises";
import mapError from "../../internal/errorMap";

export const writeTextFile: typeof Deno.writeTextFile =
  async function writeTextFile(
    path,
    data,
    { mode, signal } = {},
  ) {
    try {
      await writeFile(path, data, { signal, mode });
    } catch (error) {
      throw mapError(error);
    }
  };
