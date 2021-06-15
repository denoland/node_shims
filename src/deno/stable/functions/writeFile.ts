///<reference path="../lib.deno.d.ts" />

import { platform } from "os";
import { open } from "./open";
import mapError from "../../internal/errorMap";
import { stat } from "./stat";
import { chmod } from "./chmod";

export const writeFile: typeof Deno.writeFile = async function writeFile(
  path,
  data,
  options = {}
) {
  try {
    if (options.create !== undefined) {
      const create = !!options.create;
      if (!create) {
        // verify that file exists
        await stat(path);
      }
    }

    const openOptions = options.append
      ? { write: true, create: true, append: true }
      : { write: true, create: true, truncate: true };
    const file = await open(path, openOptions);

    if (
      options.mode !== undefined &&
      options.mode !== null &&
      platform() !== "win32"
    ) {
      await chmod(path, options.mode);
    }

    let nwritten = 0;
    while (nwritten < data.length) {
      nwritten += await file.write(data.subarray(nwritten));
    }

    file.close();
  } catch (e) {
    throw mapError(e);
  }
};
