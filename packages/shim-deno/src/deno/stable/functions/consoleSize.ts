///<reference path="../lib.deno.d.ts" />

export const consoleSize: typeof Deno.consoleSize = function consoleSize() {
  const pipes = [process.stderr, process.stdout];
  for (const pipe of pipes) {
    if (pipe.columns != null) {
      const { columns, rows } = pipe;
      return { columns, rows };
    }
  }
  // both stdout and stderr were piped (not the best Error, but it's what Deno does)
  throw new Error("The handle is invalid.");
};
