///<reference path="./lib.deno.unstable.d.ts" />

import fs from "fs";
import os from "os";
import ps from "process";
import mapError from "../internal/errorMap.js";

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
  } catch (error) {
    throw mapError(error);
  }
};

export const utime: typeof Deno.utime = async function (path, atime, mtime) {
  try {
    await fs.promises.utimes(path, atime, mtime);
  } catch (error) {
    throw mapError(error);
  }
};

export const utimeSync: typeof Deno.utimeSync = function (path, atime, mtime) {
  try {
    fs.utimesSync(path, atime, mtime);
  } catch (error) {
    throw mapError(error);
  }
};

export const kill: typeof Deno.kill = function (pid, signo) {
  if (pid < 0 && os.platform() === "win32") {
    throw new TypeError("Invalid pid");
  }
  ps.kill(pid, signo);
};
