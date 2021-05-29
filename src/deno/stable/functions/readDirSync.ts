///<reference path="../lib.deno.d.ts" />

import { readdirSync as nodeReadDir } from "fs";
import * as errors from "../variables/errors";

export const readDirSync: typeof Deno.readDirSync = function* readDir(path) {
  try {
    for (const e of nodeReadDir(String(path), { withFileTypes: true })) {
      const ent: Deno.DirEntry = {
        name: e.name,
        isFile: e.isFile(),
        isDirectory: e.isDirectory(),
        isSymlink: e.isSymbolicLink(),
      };
      yield ent;
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new errors.NotFound(err.message);
    }
  }
};
