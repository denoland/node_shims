#!/usr/bin/env -S deno run --allow-read --allow-run
// This script runs the unit tests under thirdparty/deno directory

const p = Deno.run({ cmd: ["node", "tools/skip_tests.cjs"], stdout: "piped" });
const [_, skipFiles] = await Promise.all([p.status(), p.output()]);
const testFiles = (await Deno.readTextFile("tools/working_test_files.txt"))
  .trim().split(/\s/);

const cmd = [
  "./node_modules/.bin/fdt",
  `--filter=${new TextDecoder().decode(skipFiles).trim()}`,
  "tools/setup_tests.mjs",
  ...testFiles,
];

console.log("Executing the command", cmd.join(" "));
const testRun = Deno.run({
  cmd,
  env: { NODE_OPTIONS: "--experimental-loader=ts-node/esm" },
});
const status = await testRun.status();
Deno.exit(status.code);
