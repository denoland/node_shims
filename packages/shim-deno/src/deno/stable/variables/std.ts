///<reference path="../lib.deno.d.ts" />

import stream from "stream";
import tty from "tty";
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

let stdinReadable: ReadableStream<Uint8Array> | undefined;
export const stdin: typeof Deno.stdin = {
  rid: 0,
  isTerminal() {
    return tty.isatty(this.rid);
  },
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
    if (stdinReadable == null) {
      stdinReadable = stream.Readable.toWeb(process.stdin);
    }
    return stdinReadable;
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

let stdoutWritable: WritableStream<Uint8Array> | undefined;
export const stdout: typeof Deno.stdout = {
  rid: 1,
  isTerminal() {
    return tty.isatty(this.rid);
  },
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
    if (stdoutWritable == null) {
      stdoutWritable = stream.Writable.toWeb(process.stdout);
    }
    return stdoutWritable;
  },
  writeSync(data: Uint8Array) {
    return writeSync(this.rid, data);
  },
  close() {
    process.stdout.destroy();
  },
};
let stderrWritable: WritableStream<Uint8Array> | undefined;
export const stderr: typeof Deno.stderr = {
  rid: 2,
  isTerminal() {
    return tty.isatty(this.rid);
  },
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
    if (stderrWritable == null) {
      stderrWritable = stream.Writable.toWeb(process.stderr);
    }
    return stderrWritable;
  },
  writeSync(data: Uint8Array) {
    return writeSync(this.rid, data);
  },
  close() {
    process.stderr.destroy();
  },
};
