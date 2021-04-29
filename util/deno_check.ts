if (Deno.version.deno !== "1.9.2") {
  console.error("Wrong Deno version: " + Deno.version.deno);
  Deno.exit(1);
}
