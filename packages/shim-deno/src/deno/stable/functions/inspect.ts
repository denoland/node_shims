///<reference path="../lib.deno.d.ts" />

import * as util from "node:util";

export const inspect: typeof Deno.inspect = (value, options = {}) =>
  util.inspect(value, options);
