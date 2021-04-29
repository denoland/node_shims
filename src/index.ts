///<reference path="lib.deno.d.ts" />

import * as _Deno from "./deno.js";

//@ts-expect-error
export const Deno: typeof globalThis.Deno = _Deno;
