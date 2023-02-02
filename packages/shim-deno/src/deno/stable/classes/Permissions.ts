///<reference path="../lib.deno.d.ts" />

import { PermissionStatus } from "../classes/PermissionStatus.js";

export class Permissions implements Deno.Permissions {
  query(desc: Deno.PermissionDescriptor) {
    return Promise.resolve(this.querySync(desc));
  }

  querySync(_desc: Deno.PermissionDescriptor) {
    return new PermissionStatus("granted");
  }

  revoke(desc: Deno.PermissionDescriptor) {
    return Promise.resolve(this.revokeSync(desc));
  }

  revokeSync(_desc: Deno.PermissionDescriptor) {
    return new PermissionStatus("denied");
  }

  request(desc: Deno.PermissionDescriptor) {
    return this.query(desc);
  }

  requestSync(desc: Deno.PermissionDescriptor) {
    return this.querySync(desc);
  }
}
