///<reference path="../lib.deno.d.ts" />

// The listeners don't actually matter because the state of these permissions
// is constant and mocked as Node.js has all doors open.

(globalThis as any).EventTarget ??= require("events").EventTarget ?? null;

export class PermissionStatus extends EventTarget
  implements Deno.PermissionStatus {
  onchange: ((this: PermissionStatus, ev: Event) => any) | null = null;

  /** @internal */
  constructor(readonly state: Deno.PermissionState) {
    super();
  }
}
