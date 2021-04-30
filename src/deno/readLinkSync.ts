///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";

export const readLinkSync: typeof Deno.readLinkSync = fs.readlinkSync;
