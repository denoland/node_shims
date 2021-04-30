///<reference path="../lib.deno.d.ts" />

import * as util from "util";

export const inspect: typeof Deno.inspect = util.inspect;
