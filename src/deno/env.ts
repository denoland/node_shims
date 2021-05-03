///<reference path="../lib.deno.d.ts" />

export const env: typeof Deno.env = {
  get(key) {
    return process.env[key];
  },
  set(key, value) {
    process.env[key] = value;
  },
  delete(key) {
    delete process.env[key];
  },
  // @ts-expect-error https://github.com/denoland/deno/issues/10267
  toObject() {
    return { ...process.env };
  },
};
