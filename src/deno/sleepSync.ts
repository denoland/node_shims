///<reference path="../lib.deno.d.ts" />

export const sleepSync = function sleepSync(millis: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, millis);
};
