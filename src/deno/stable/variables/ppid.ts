///<reference path="../lib.deno.d.ts" />

// @ts-expect-error ppid is documented as unstable but available in stable
export const ppid: Deno.ppid = process.ppid;
