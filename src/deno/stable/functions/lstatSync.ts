///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import { denoifyFileInfo } from "./stat";

export const lstatSync: typeof Deno.lstatSync = (path) =>
  denoifyFileInfo(fs.lstatSync(path));
