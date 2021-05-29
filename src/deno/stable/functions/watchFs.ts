///<reference path="../lib.deno.d.ts" />

import { watch } from "fs";
import { resolve } from "path";

export const watchFs: typeof Deno.watchFs = async function* watchFs(
  paths,
  options,
) {
  const queue: Deno.FsEvent[] = [];
  for (const path of (Array.isArray(paths) ? paths : [paths])) {
    watch(
      path,
      { recursive: options?.recursive },
      (_, filename) =>
        queue.push({ kind: "modify", paths: [resolve(path, filename)] }),
    );
  }
  while (true) {
    const item = queue.shift();
    if (item) {
      yield item;
    }
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
};
