///<reference path="../lib.deno.d.ts" />

export const consoleSize: typeof Deno.consoleSize = function consoleSize() {
  const pipes = [process.stderr, process.stdout];
  for (const pipe of pipes) {
    if (pipe.columns != null) {
      const { columns, rows } = pipe;
      return { columns, rows };
    }
  }
  // Both stdout and stderr were piped. This is not the best error message,
  // but it's what Deno does. Opened: https://github.com/denoland/deno/issues/22162
  throw new Error("The handle is invalid.");
};
