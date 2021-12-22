///<reference path="../lib.deno.d.ts" />

import * as fs from "fs/promises";
import { denoifyFileInfo } from "./stat.js";

export const lstat: typeof Deno.lstat = async (path) =>
  denoifyFileInfo(await fs.lstat(path));
