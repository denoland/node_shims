///<reference path="../lib.deno.d.ts" />

import { open } from "./open";

export const create: typeof Deno.create = async function create(path) {
  return await open(path, { create: true, truncate: true });
};
