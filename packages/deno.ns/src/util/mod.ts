///<reference path="../deno/stable/lib.deno.d.ts" />

import { writeSync } from "fs";
import { readlineSync } from "./readlineSync.js";

export const alert: typeof globalThis.alert = globalThis["alert"] ??
  function alert(message) {
    writeSync(
      process.stdout.fd,
      new TextEncoder().encode(`${message} [Enter] `),
    );
    readlineSync();
  };

export const confirm: typeof globalThis.confirm = globalThis["confirm"] ??
  function confirm(message) {
    writeSync(process.stdout.fd, new TextEncoder().encode(`${message} [y/N] `));
    const result = readlineSync();
    return ["y", "Y"].includes(result);
  };

export const prompt: typeof globalThis.prompt = globalThis["prompt"] ??
  function prompt(
    message,
    defaultValue = undefined,
  ) {
    writeSync(
      process.stdout.fd,
      new TextEncoder().encode(
        `${message} ${defaultValue == null ? "" : `[${defaultValue}]`} `,
      ),
    );
    const result = readlineSync();
    return result.length > 0 ? result : defaultValue ?? null;
  };
