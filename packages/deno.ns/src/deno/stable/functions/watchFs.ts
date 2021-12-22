///<reference path="../lib.deno.d.ts" />

import { watch } from "fs/promises";
import { resolve } from "path";

import { mapAsync, merge } from "../../internal/iterutil.js";

export const watchFs: typeof Deno.watchFs = function watchFs(
  paths,
  options = { recursive: true },
) {
  paths = Array.isArray(paths) ? paths : [paths];

  const ac = new AbortController();
  const { signal } = ac;

  // TODO(mkr): create valid rids for watchers
  const rid = -1;

  const masterWatcher = merge(
    paths.map((path) =>
      mapAsync(
        watch(path, { recursive: options?.recursive, signal }),
        (info) => ({
          kind: "modify" as const,
          paths: [resolve(path, info.filename)],
        }),
      )
    ),
  );

  function close() {
    ac.abort();
  }

  return Object.assign(masterWatcher, { rid, close });
};
