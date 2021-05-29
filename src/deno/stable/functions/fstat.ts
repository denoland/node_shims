///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import { promisify } from "util";
import { denoifyFileInfo } from "./stat";

const nodeFstat = promisify(fs.fstat);

export const fstat: typeof Deno.fstat = async (fd) =>
  denoifyFileInfo(await nodeFstat(fd));
