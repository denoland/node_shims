///<reference path="../lib.deno.d.ts" />

import { fdatasync as nodefdatasync } from "node:fs";
import { promisify } from "node:util";

const _fdatasync = promisify(nodefdatasync);

export const fdatasync: typeof Deno.fdatasync = _fdatasync;
