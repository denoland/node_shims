///<reference path="../lib.deno.d.ts" />

import { PermissionStatus } from "../classes/PermissionStatus";

export class Permissions implements Deno.Permissions {
  query(_desc: Deno.PermissionDescriptor) {
    return Promise.resolve(new PermissionStatus("granted"));
  }
  revoke(_desc: Deno.PermissionDescriptor) {
    return Promise.resolve(new PermissionStatus("denied"));
  }
  request(desc: Deno.PermissionDescriptor) {
    return this.query(desc);
  }
}
