const { testsToSkip } = require("./skip_tests.cjs");
const { tests } = require("../dist/deno/stable/functions/test.js");
require("../dist/global.js");
require("sucrase/register/ts");
const {
  red,
  green,
  yellow,
} = require("../thirdparty/deno/test_util/std/fmt/colors.ts");

const ok = green("ok");
const failed = red("FAILED");
const skipped = yellow("skipped");

// exit code 255 aborts xargs
process.on("SIGINT", () => process.exit(255));

process.chdir("thirdparty/deno/");
require(`../${Deno.args[0]}`);
console.log(`running ${tests.length} tests from ${Deno.args[0]}`);

(async () => {
  for (const t of tests) {
    if (testsToSkip.has(t.name)) {
      console.log(`test ${t.name} ... ${skipped}`);
      continue;
    }
    try {
      await t.fn();
      console.log(`test ${t.name} ... ${ok}`);
    } catch (err) {
      process.exitCode = 1;
      console.log(`test ${t.name} ... ${failed}\n${err}`);
    }
  }
})();
