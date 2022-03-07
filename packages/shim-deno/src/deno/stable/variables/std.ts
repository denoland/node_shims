///<reference path="../lib.deno.d.ts" />

interface Deferred<T> extends Promise<T> {
  resolve(value: T): void;
  reject(reason?: any): void;
}
function defer<T>(): Deferred<T> {
  const transit: any = {};
  const result = new Promise((resolve, reject) =>
    Object.assign(transit, { resolve, reject })
  );
  return Object.assign(result, transit);
}

export const stdin: typeof Deno.stdin = {
  rid: 0,
  read(p) {
    const result = defer<number | null>();
    p.fill(0);
    process.stdin.resume();
    process.stdin.once("readable", () => {
      const data = process.stdin.read(p.length) ?? process.stdin.read();
      p.set(data);
      result.resolve(data.length > 0 ? data.length : null);
    });
    return result.then((res) => {
      process.stdin.pause();
      return res;
    });
  },
  get readable(): ReadableStream<Uint8Array> {
    throw new Error("Not implemented.");
  },
  readSync() {
    // Node.js doesn't support readSync for stdin
    throw new Error("Not implemented.");
  },
  close() {
    process.stdin.destroy();
  },
};
export const stdout: typeof Deno.stdout = {
  rid: 1,
  write(p) {
    const deferred = defer<number>();
    const result = process.stdout.write(p);
    if (!result) {
      process.stdout.once("drain", () => deferred.resolve(p.length));
    } else {
      deferred.resolve(p.length);
    }
    return deferred;
  },
  get writable(): WritableStream<Uint8Array> {
    throw new Error("Not implemented.");
  },
  writeSync() {
    // Node.js doesn't support writeSync for stdout
    throw new Error("Not implemented");
  },
  close() {
    process.stdout.destroy();
  },
};
export const stderr: typeof Deno.stderr = {
  rid: 2,
  write(p) {
    const deferred = defer<number>();
    const result = process.stderr.write(p);
    if (!result) {
      process.stderr.once("drain", () => deferred.resolve(p.length));
    } else {
      deferred.resolve(p.length);
    }
    return deferred;
  },
  get writable(): WritableStream<Uint8Array> {
    throw new Error("Not implemented.");
  },
  writeSync() {
    // Node.js doesn't support readSync for stderr
    throw new Error("Not implemented");
  },
  close() {
    process.stderr.destroy();
  },
};
