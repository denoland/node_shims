///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import { denoifyFileInfo } from "./stat";

export const fstatSync: typeof Deno.fstatSync = (fd) =>
  denoifyFileInfo(fs.fstatSync(fd));
