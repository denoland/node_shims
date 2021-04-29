///<reference path="../lib.deno.d.ts" />

import { opendir } from 'fs/promises';
import { errors } from './errors.js';

export const readDir: typeof Deno.readDir = async function* readDir(path) {
	try {
		for await (const e of await opendir(String(path))) {
			const ent: Deno.DirEntry = {
				name: e.name,
				isFile: e.isFile(),
				isDirectory: e.isDirectory(),
				isSymlink: e.isSymbolicLink()
			};
			yield ent;
		}
	} catch (err) {
		if (err.code === 'ENOENT') {
			throw new errors.NotFound(err.message);
		}
	}
};
