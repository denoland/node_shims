export const version = "1.43.3";

export function ensureSpecificDenoVersion() {
  if (Deno.version.deno !== "1.43.3") {
    console.error("Wrong Deno version: " + Deno.version.deno);
    Deno.exit(1);
  }
}
