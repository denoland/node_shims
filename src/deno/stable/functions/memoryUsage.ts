///<reference path="../lib.deno.d.ts" />

// @ts-expect-error memoryUsage is documented as unstable but available in stable
export const memoryUsage: typeof Deno.memoryUsage = process.memoryUsage;
