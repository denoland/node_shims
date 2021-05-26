if (Deno.version.deno !== "1.10.2") {
  console.error("Wrong Deno version: " + Deno.version.deno);
  Deno.exit(1);
}

const out = new TextDecoder().decode(
  await Deno.run({
    cmd: ["deno", "types"],
    stdout: "piped",
  }).output(),
);

await Deno.writeTextFile(
  "src/lib.deno.d.ts",
  out
    .replace(
      `/** A controller object that allows you to abort one or more DOM requests as and
 * when desired. */
declare class AbortController {
  /** Returns the AbortSignal object associated with this object. */
  readonly signal: AbortSignal;
  /** Invoking this method will set this object's AbortSignal's aborted flag and
    * signal to any observers that the associated activity is to be aborted. */
  abort(): void;
}
`,
      "",
    ),
);
