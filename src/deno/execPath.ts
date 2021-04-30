///<reference path="../lib.deno.d.ts" />

export const execPath: typeof Deno.execPath = () => process.argv0;
