/// <reference path="../lib.deno.d.ts" />

import ps from "process";

export const removeSignalListener: typeof Deno.removeSignalListener = (
  signal,
  handler,
) => {
  ps.removeListener(signal, handler);
};
