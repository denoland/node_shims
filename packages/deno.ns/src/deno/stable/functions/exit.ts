///<reference path="../lib.deno.d.ts" />

export const exit: typeof Deno.exit = function exit(code) {
  return process.exit(code);
};
