///<reference path="../lib.deno.d.ts" />

import { ftruncate as nodeftruncate } from "node:fs";
import { promisify } from "node:util";

const _ftruncate = promisify(nodeftruncate);

export const ftruncate: typeof Deno.ftruncate = _ftruncate;
