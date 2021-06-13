///<reference path="../lib.deno.d.ts" />

import { watch } from "fs/promises";
import { resolve } from "path";

import { merge, map } from "../../internal/iterutil.js";

export const watchFs: typeof Deno.watchFs = function watchFs(
  paths,
  options = { recursive: true }
) {
  paths = Array.isArray(paths) ? paths : [paths];

  const ac = new AbortController();
  const { signal } = ac;

  // TODO(mkr): create valid rids for watchers
  const rid = -1;

  const masterWatcher = merge(
    paths.map((path) =>
      map(
        watch(path, { recursive: options?.recursive, signal }),
        (filename) => ({
          kind: "modify" as const,
          paths: [resolve(path, filename)],
        })
      )
    )
  );

  function close() {
    ac.abort();
  }

  return Object.assign(masterWatcher, { rid, close });
};
