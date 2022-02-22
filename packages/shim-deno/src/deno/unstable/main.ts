///<reference path="./lib.deno.unstable.d.ts" />

import fs from "fs";
import mapError from "../internal/errorMap.js";
import { errors } from "../stable/variables.js";

export type TlsHandshakeInfo = Deno.TlsHandshakeInfo;
export type UnixConnectOptions = Deno.UnixConnectOptions;
export type UnixListenOptions = Deno.UnixListenOptions;

export const futime: typeof Deno.futime = async function (rid, atime, mtime) {
  try {
    await new Promise<void>((resolve, reject) => {
      // doesn't exist in fs.promises
      fs.futimes(rid, atime, mtime, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    throw mapError(error);
  }
};

export const futimeSync: typeof Deno.futimeSync = function (rid, atime, mtime) {
  try {
    fs.futimesSync(rid, atime, mtime);
  } catch (error: any) {
    throw mapError(error);
  }
};

export const utime: typeof Deno.utime = async function (path, atime, mtime) {
  try {
    await fs.promises.utimes(path, atime, mtime);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      throw new errors.NotFound(
        `No such file or directory (os error 2), utime '${path}'`,
      );
    }
    throw mapError(error);
  }
};

export const utimeSync: typeof Deno.utimeSync = function (path, atime, mtime) {
  try {
    fs.utimesSync(path, atime, mtime);
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      throw new errors.NotFound(
        `No such file or directory (os error 2), utime '${path}'`,
      );
    }
    throw mapError(error);
  }
};

export const sleepSync: typeof Deno.sleepSync = function (
  milliseconds: number,
) {
  // https://github.com/sindresorhus/sleep-synchronously/blob/main/index.js
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
};
