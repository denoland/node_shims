///<reference path="../lib.deno.d.ts" />

export const resources: typeof Deno.resources = function resources() {
  console.warn(
    [
      "Deno.resources() shim returns a dummy object that does not update.",
      "If you think this is a mistake, raise an issue at https://github.com/denoland/node_deno_shims/issues",
    ].join("\n"),
  );

  return {};
};
