///<reference path="./lib.deno.unstable.d.ts" />

import fs from "fs";
import mapError from "../internal/errorMap.js";

export const futime: typeof Deno.futime = async function (
  rid: number,
  atime: number | Date,
  mtime: number | Date,
) {
  try {
    await new Promise<void>((resolve, reject) => {
      // doesn't exist in futimes
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

export const futimeSync: typeof Deno.futimeSync = function (
  rid: number,
  atime: number | Date,
  mtime: number | Date,
) {
  try {
    fs.futimesSync(rid, atime, mtime);
  } catch (error) {
    throw mapError(error);
  }
};

export const utime: typeof Deno.utime = async function (
  path: string | URL,
  atime: number | Date,
  mtime: number | Date,
) {
  try {
    await fs.promises.utimes(path, atime, mtime);
  } catch (error) {
    throw mapError(error);
  }
};

export const utimeSync: typeof Deno.utimeSync = function (
  path: string | URL,
  atime: number | Date,
  mtime: number | Date,
) {
  try {
    fs.utimesSync(path, atime, mtime);
  } catch (error) {
    throw mapError(error);
  }
};
