///<reference path="../lib.deno.d.ts" />

export const consoleSize: typeof Deno.consoleSize = function consoleSize() {
  const { columns, rows } = process.stdout;
  return { columns, rows };
};
