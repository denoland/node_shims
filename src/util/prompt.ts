import { writeSync } from "fs";
import { readlineSync } from "./readlineSync.js";

export const prompt: typeof globalThis.prompt = function prompt(
  message,
  defaultValue = null,
) {
  writeSync(
    process.stdout.fd,
    new TextEncoder().encode(
      `${message} ${defaultValue == null ? "" : `[${defaultValue}]`} `,
    ),
  );
  const result = readlineSync();
  return result.length > 0 ? result : defaultValue;
};
