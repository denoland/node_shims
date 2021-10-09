///<reference path="../lib.deno.d.ts" />

// This file is not exported in functions.ts; we must come back when sleepSync is stable
// @ts-expect-error sleepSync was previously documented as unstable but available in stable
export const sleepSync: Deno.sleepSync = function sleepSync(millis: number) {
  // buffer will never change to awaited value,
  // Atomics will block the thread for given milliseconds and return
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, millis);
};
