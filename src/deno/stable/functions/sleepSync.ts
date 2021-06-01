///<reference path="../lib.deno.d.ts" />

// @ts-expect-error sleepSync is documented as unstable but available in stable
export const sleepSync: Deno.sleepSync = function sleepSync(millis: number) {
  // buffer will never change to awaited value,
  // Atomics will block the thread for given milliseconds and return
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, millis);
};
