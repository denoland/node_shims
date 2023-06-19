///<reference path="../lib.deno.d.ts" />

import { readSync } from "../functions/readSync.js";
import { writeSync } from "../functions/writeSync.js";

function chain<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cleanup?: () => void,
): T {
  let prev: Promise<any> | undefined;
  return function _fn(...args) {
    const curr = (prev || Promise.resolve())
      .then(() => fn(...args))
      .finally(cleanup || (() => {}))
      .then((result) => {
        if (prev === curr) prev = undefined;
        return result;
      });
    return (prev = curr);
  } as T;
}

export const stdin: typeof Deno.stdin = {
  rid: 0,
  read: chain(
    (p) => {
      return new Promise((resolve, reject) => {
        process.stdin.resume();
        process.stdin.on("error", onerror);
        process.stdin.once("readable", () => {
          process.stdin.off("error", onerror);
          const data = process.stdin.read(p.length) ?? process.stdin.read();
          if (data) {
            p.set(data);
            resolve(data.length > 0 ? data.length : null);
          } else {
            resolve(null);
          }
        });
        function onerror(error: Error) {
          reject(error);
          process.stdin.off("error", onerror);
        }
      });
    },
    () => process.stdin.pause(),
  ),
  get readable(): ReadableStream<Uint8Array> {
    throw new Error("Not implemented.");
  },
  readSync(buffer: Uint8Array) {
    return readSync(this.rid, buffer);
  },
  close() {
    process.stdin.destroy();
  },
  setRaw(mode, options) {
    if (options?.cbreak) {
      throw new Error("The cbreak option is not implemented.");
    }
    process.stdin.setRawMode(mode);
  },
};
export const stdout: typeof Deno.stdout = {
  rid: 1,
  write: chain((p) => {
    return new Promise((resolve) => {
      const result = process.stdout.write(p);
      if (!result) {
        process.stdout.once("drain", () => resolve(p.length));
      } else {
        resolve(p.length);
      }
    });
  }),
  get writable(): WritableStream<Uint8Array> {
    throw new Error("Not implemented.");
  },
  writeSync(data: Uint8Array) {
    return writeSync(this.rid, data);
  },
  close() {
    process.stdout.destroy();
  },
};
export const stderr: typeof Deno.stderr = {
  rid: 2,
  write: chain((p) => {
    return new Promise((resolve) => {
      const result = process.stderr.write(p);
      if (!result) {
        process.stderr.once("drain", () => resolve(p.length));
      } else {
        resolve(p.length);
      }
    });
  }),
  get writable(): WritableStream<Uint8Array> {
    throw new Error("Not implemented.");
  },
  writeSync(data: Uint8Array) {
    return writeSync(this.rid, data);
  },
  close() {
    process.stderr.destroy();
  },
};
