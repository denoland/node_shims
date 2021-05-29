///<reference path="../lib.deno.d.ts" />

export const sleepSync = function sleepSync(millis: number) {
  // buffer will never change to awaited value,
  // Atomics will block the thread for given milliseconds and return
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, millis);
};
