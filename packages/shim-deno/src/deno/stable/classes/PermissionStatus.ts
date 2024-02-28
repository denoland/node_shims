///<reference path="../lib.deno.d.ts" />

export class PermissionStatus extends EventTarget
  implements Deno.PermissionStatus {
  onchange: ((this: PermissionStatus, ev: Event) => any) | null = null;
  readonly partial: boolean = false;

  /** @internal */
  constructor(readonly state: Deno.PermissionState) {
    super();
  }
}
