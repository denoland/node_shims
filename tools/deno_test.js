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

const failures = [];

process.chdir("thirdparty/deno/");

(async () => {
  for (const path of Deno.args) {
    tests.length = 0;
    require(`../${path}`);
    console.log(`running ${tests.length} tests from ${path}`);
    for (const t of tests) {
      if (testsToSkip.has(t.name)) {
        console.log(`test ${t.name} ... ${skipped}`);
        continue;
      }
      try {
        await t.fn();
        console.log(`test ${t.name} ... ${ok}`);
      } catch (error) {
        process.exitCode = 1;
        console.log(`test ${t.name} ... ${failed}`);
        failures.push({ t, error });
      }
    }
  }
  if (failures.length) {
    console.log(failures.length, "tests failed:");
    for (const { t, error } of failures) {
      console.log();
      console.log(t.name);
      console.log(error);
    }
  }
})();
