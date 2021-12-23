///<reference path="../lib.deno.d.ts" />

import { Permissions } from "../classes/Permissions.js";

export const permissions: typeof Deno.permissions = new Permissions();
