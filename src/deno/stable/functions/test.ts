///<reference path="../lib.deno.d.ts" />

const runTests = process.env.DENO_TEST === "1";

const tests: (() => Promise<void>)[] = [];

const skipTests = new Set((process.env.DENO_TEST_SKIP || "").split(/,\s*/));

export const test: typeof Deno.test = Object.assign(
  function test(
    name: Parameters<typeof Deno.test>[0],
    fn: Parameters<typeof Deno.test>[1]
  ) {
    if (!runTests) return;

    const t: Deno.TestDefinition =
      typeof name === "string" ? { name, fn } : name;
    tests.push(async () => {
      if (skipTests.has(t.name)) {
        console.log(`test ${t.name} ... SKIPPED`);
        return;
      }

      const start = Date.now();
      try {
        await t.fn();
      } catch (err) {
        process.exitCode = 1;
        console.error(`test ${t.name} ... FAILED (${Date.now() - start}ms)`);
        console.error(`\t${err.message}`);
        return;
      }
      console.log(`test ${t.name} ... ok (${Date.now() - start}ms)`);
    });
  },
  { __tests: tests }
) as typeof Deno.test & { __tests: [] };
