///<reference path="../lib.deno.d.ts" />

import { File } from "../classes/FsFile.js";

export const stdin: typeof Deno.stdin = new File(0);
export const stdout: typeof Deno.stdout = new File(1);
export const stderr: typeof Deno.stderr = new File(2);
