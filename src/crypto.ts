///<reference path="lib.deno.d.ts" />

import { randomFillSync } from 'crypto';
export const crypto: typeof globalThis.crypto = {
	getRandomValues(p) {
		randomFillSync(p);
		return p;
	},
	subtle: null
};
