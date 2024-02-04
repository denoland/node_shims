///<reference path="../lib.deno.d.ts" />

import { opendir } from "node:fs/promises";
import mapError from "../../internal/errorMap.js";

export const readDir: typeof Deno.readDir = async function* readDir(path) {
  try {
    for await (const e of await opendir(String(path))) {
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
