///<reference path="../lib.deno.d.ts" />

import { stat as node_stat } from 'fs/promises';

export const stat: typeof Deno.stat = async function stat(path) {
	const s = await node_stat(path);
	const stats: Deno.FileInfo = {
		atime: s.atime,
		birthtime: s.birthtime,
		blksize: s.blksize,
		blocks: s.blocks,
		dev: s.dev,
		gid: s.gid,
		ino: s.ino,
		isDirectory: s.isDirectory(),
		isFile: s.isFile(),
		isSymlink: s.isSymbolicLink(),
		mode: s.mode,
		mtime: s.mtime,
		nlink: s.nlink,
		rdev: s.rdev,
		size: s.size,
		uid: s.uid
	};
	return stats;
};
