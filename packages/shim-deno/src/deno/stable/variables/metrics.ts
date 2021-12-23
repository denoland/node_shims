///<reference path="../lib.deno.d.ts" />

export const metrics: typeof Deno.metrics = function metrics() {
  console.warn(
    [
      "Deno.metrics() shim returns a dummy object that does not update.",
      "If you think this is a mistake, raise an issue at https://github.com/denoland/node-shims/issues",
    ].join("\n"),
  );

  return {
    opsDispatched: 0,
    opsDispatchedSync: 0,
    opsDispatchedAsync: 0,
    opsDispatchedAsyncUnref: 0,
    opsCompleted: 0,
    opsCompletedSync: 0,
    opsCompletedAsync: 0,
    opsCompletedAsyncUnref: 0,
    bytesSentControl: 0,
    bytesSentData: 0,
    bytesReceived: 0,
    ops: {},
  };
};
