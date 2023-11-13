///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import { promisify } from "util";
import { denoifyFileInfo } from "./stat.js";
import mapError from "../../internal/errorMap.js";

const nodeFstat = promisify(fs.fstat);

export const fstat: typeof Deno.fstat = async function (fd) {
  try {
    return denoifyFileInfo(await nodeFstat(fd));
  } catch (err) {
    throw mapError(err);
  }
};
