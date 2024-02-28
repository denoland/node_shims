export const version = "1.40.2";

export function ensureSpecificDenoVersion() {
  if (Deno.version.deno !== "1.40.2") {
    console.error("Wrong Deno version: " + Deno.version.deno);
    Deno.exit(1);
  }
}
