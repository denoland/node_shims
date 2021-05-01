///<reference path="../lib.deno.d.ts" />

export const noColor: typeof Deno.noColor = process.env.NO_COLOR !== undefined;
