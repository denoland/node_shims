///<reference path="../lib.deno.d.ts" />

import { watch } from "fs";
import type { FSWatcher as NodeFSWatcher } from "fs";
import { resolve } from "path";
import { setTimeout } from "timers/promises";

export const watchFs: typeof Deno.watchFs = function watchFs(
  paths,
  options = { recursive: true }
) {
  paths = Array.isArray(paths) ? paths : [paths];

  // TODO(mkr): create valid rids for watchers
  const rid = -1;
  const queue: Deno.FsEvent[] = [];

  const watchers: NodeFSWatcher[] = paths.map((path) =>
    watch(path, { recursive: options?.recursive }, (_, filename) =>
      queue.push({ kind: "modify", paths: [resolve(path, filename)] })
    )
  );

  function close() {
    watchers.forEach((watcher) => watcher.close());
  }

  return Object.assign(
    (async function* FsWatcher() {
      while (true) {
        const value = queue.shift();

        if (value) yield value;

        await setTimeout(5);
      }
    })(),
    { rid, close }
  );
};
