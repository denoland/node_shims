///<reference path="../lib.deno.d.ts" />

export const chdir: typeof Deno.chdir = function (path: string | URL) {
  if (path instanceof URL) {
    if (path.protocol === "file:") return process.chdir(path.pathname);
    throw new TypeError("Must be a file URL.");
  } else return process.chdir(path);
};
