import { writeSync } from "fs";
import { readlineSync } from "./readlineSync.js";

export const alert: (typeof globalThis) extends { [P in "alert"]: infer T } ? T
  : (message?: any) => void = (globalThis as any)["alert"] ??
    function alert(message) {
      writeSync(
        process.stdout.fd,
        new TextEncoder().encode(`${message} [Enter] `),
      );
      readlineSync();
    };

export const confirm: (typeof globalThis) extends { [P in "confirm"]: infer T }
  ? T
  : (message?: string) => boolean = (globalThis as any)["confirm"] ??
    function confirm(message) {
      writeSync(
        process.stdout.fd,
        new TextEncoder().encode(`${message} [y/N] `),
      );
      const result = readlineSync();
      return ["y", "Y"].includes(result);
    };

export const prompt: (typeof globalThis) extends { [P in "prompt"]: infer T }
  ? T
  : (message?: string, _default?: string) => string | null =
    (globalThis as any)["prompt"] ??
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
