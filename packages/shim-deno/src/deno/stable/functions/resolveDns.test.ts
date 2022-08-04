import assert from "assert/strict";
import { resolveDns } from "./resolveDns.js";

/**
 * A reference to this test in
 * packages/shim-deno/tools/working_test_files.txt
 * activate this test file.
 */

Deno.test("resolve A as ipV4 string", async () => {
  const ips = await resolveDns("www.github.com", "A");
  assert(ips[0].match(/(\d+\.){3}\d+/), "Must be a IP v4");
});

Deno.test("resolve A as ipV6 string", async () => {
  const ips = await resolveDns("www.google.com", "AAAA");
  assert(ips[0].match(/[0-9a-f]{1,4}:[0-9a-f:]+/), "Must be a IP v6");
});
