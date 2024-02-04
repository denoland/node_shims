///<reference path="../lib.deno.d.ts" />

import { readdirSync as nodeReadDir } from "node:fs";
import mapError from "../../internal/errorMap.js";

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
  } catch (e) {
    throw mapError(e);
  }
};
