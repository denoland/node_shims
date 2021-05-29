///<reference path="../lib.deno.d.ts" />

import { mkdir as nodeMkdir } from "fs/promises";

export const mkdir: typeof Deno.mkdir = async function mkdir(p, o) {
  await nodeMkdir(p, o);
};
