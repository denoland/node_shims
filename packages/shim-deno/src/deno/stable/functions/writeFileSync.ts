///<reference path="../lib.deno.d.ts" />

import { platform } from "os";
import { openSync } from "./openSync.js";
import mapError from "../../internal/errorMap.js";
import { statSync } from "./statSync.js";
import { chmodSync } from "./chmodSync.js";

export const writeFileSync: typeof Deno.writeFileSync = function writeFileSync(
  path,
  data,
  options = {},
) {
  try {
    if (options.create !== undefined) {
      const create = !!options.create;
      if (!create) {
        // verify that file exists
        statSync(path);
      }
    }

    const openOptions = {
      write: true,
      create: true,
      createNew: options.createNew,
      append: !!options.append,
      truncate: !options.append,
    };
    const file = openSync(path, openOptions);

    if (
      options.mode !== undefined &&
      options.mode !== null &&
      platform() !== "win32"
    ) {
      chmodSync(path, options.mode);
    }

    let nwritten = 0;
    while (nwritten < data.length) {
      nwritten += file.writeSync(data.subarray(nwritten));
    }

    file.close();
  } catch (e) {
    throw mapError(e);
  }
};
