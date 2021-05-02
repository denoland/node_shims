///<reference path="../lib.deno.d.ts" />

// The listeners don't actually matter because the state of these permissions
// is constant and mocked as Node.js has all doors open.

class PermissionStatus extends EventTarget implements Deno.PermissionStatus {
  onchange: Deno.PermissionStatus["onchange"];

  constructor(readonly state: Deno.PermissionStatus["state"]) {
    super();
  }
}

export const permissions: typeof Deno.permissions = {
  query(_query) {
    return Promise.resolve(new PermissionStatus("granted"));
  },
  revoke(_query) {
    return Promise.resolve(new PermissionStatus("denied"));
  },
  request(query) {
    return this.query(query);
  },
};
