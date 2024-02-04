/// <reference path="../lib.deno.d.ts" />

import ps from "node:process";

function denoSignalToNodeJs(signal: Deno.Signal): NodeJS.Signals {
  if (signal === "SIGEMT") {
    throw new Error("SIGEMT is not supported");
  }
  return signal;
}

export const addSignalListener: typeof Deno.addSignalListener = (
  signal,
  handler,
) => {
  ps.addListener(denoSignalToNodeJs(signal), handler);
};
