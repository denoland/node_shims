///<reference path="../lib.deno.d.ts" />

import { mkdir as node_mkdir } from "fs/promises";

export const mkdir: typeof Deno.mkdir = async function mkdir(p, o) {
  return node_mkdir(p, o).then(() => {});
};
