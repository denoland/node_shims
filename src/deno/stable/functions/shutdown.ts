///<reference path="../lib.deno.d.ts" />

import { Socket } from "net";

export const shutdown: typeof Deno.shutdown = async function shutdown(rid) {
  await new Promise<void>((resolve) => new Socket({ fd: rid }).end(resolve));
};
