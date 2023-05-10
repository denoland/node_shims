/// <reference path="../lib.deno.d.ts" />

import ps from "process";

export const addSignalListener: typeof Deno.addSignalListener = (
  signal,
  handler,
) => {
  ps.addListener(signal, handler);
};
