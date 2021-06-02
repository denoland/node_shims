///<reference path="../lib.deno.d.ts" />

const tests: (() => Promise<void>)[] = [];

export const test: typeof Deno.test = Object.assign(function test(
  name: Parameters<typeof Deno.test>[0],
  fn: Parameters<typeof Deno.test>[1],
) {
  if (process.env.RUN_DENO_TEST !== "1") return;

  const t: Deno.TestDefinition = typeof name === "string" ? { name, fn } : name;
  tests.push(
    (async () => {
      const start = Date.now();
      try {
        await t.fn();
      } catch (err) {
        process.exitCode = 1;
        console.log(`test ${t.name} ... FAILED (${Date.now() - start}ms)`);
        console.log(`\t${err.message}`);
        return;
      }
      console.log(`test ${t.name} ... ok (${Date.now() - start}ms)`);
    }),
  );
}, { __tests: tests }) as typeof Deno.test & { __tests: [] };
