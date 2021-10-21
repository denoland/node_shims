// This script runs the unit tests under thirdparty/deno directory

import fs from "fs";
import { createRequire } from "module";

// rq = requires
const testsToSkip = new Set([
  // blob_test
  "blobBuffer", // experimental native Blob
  "blobCustomInspectFunction", // experimental native Blob

  // copy_file_test
  "copyFileSyncPerm1", // permissions
  "copyFileSyncPerm2", // permissions
  "copyFilePerm1", // permissions
  "copyFilePerm2", // permissions

  // dir_test
  "dirCwdError", // fails on Linux, reason unknown
  "dirCwdPermError", // permissions

  // event_target_test
  "eventTargetThisShouldDefaultToWindow", // window

  // mkdir_test
  "mkdirMode", // depends on Deno.umask
  "mkdirRecursiveIfExists", // depends on Deno.umask
  "mkdirRecursiveMode", // depends on Deno.umask
  "mkdirSyncMode", // depends on Deno.umask
  "mkdirSyncRecursiveIfExists", // depends on Deno.umask
  "mkdirSyncRecursiveMode", // depends on Deno.umask
  "mkdirSyncErrors", // getCreationFlag throws
  "mkdirSyncPerm", // permissions

  // read_file_test
  "readFileSyncPerm", // permissions
  "readFilePerm", // permissions
  "readFileDoesNotLeakResources", //TODO, rq: Deno.resources
  "readFileSyncDoesNotLeakResources", //TODO, rq: Deno.resources

  // read_text_file_test
  "readTextFileSyncPerm", // permissions
  "readTextFilePerm", // permissions
  "readTextFileDoesNotLeakResources", //TODO, rq: Deno.resources
  "readTextFileSyncDoesNotLeakResources", //TODO, rq: Deno.resources

  // read_dir_test
  "readDirSyncPerm", // permissions
  "readDirPerm", // permissions

  // timers_test
  "clearTimeoutShouldConvertToNumber", // Timeout is an object, not a number
  "clearTimeoutShouldThrowWithBigint", // Timeout is an object, not a number
  "sleepSync", // unstable
  "sleepSyncLongerPromise", // unstable
  "sleepSyncShorterPromise", // unstable
  "stringifyAndEvalNonFunctions",
  "testFunctionParamsLength",
  "timeoutBindThis",
  "timeoutCallbackThis",
  "timeoutEvalNoScopeLeak",

  // truncate_test
  "truncateSyncPerm", // permissions
  "truncatePerm", // permissions

  // url_test
  "customInspectFunction",
  "urlDriveLetter",
  "urlPathRepeatedSlashes",

  // write_file_test
  "writeFileAbortSignalPreAborted", // implementation detail
  "writeFileSyncPerm", // permissions
  "writeFilePerm", // permissions

  // write_text_file_test
  "writeTextFileSyncPerm", // permissions
  "writeTextFilePerm", // permissions

  // utime_test
  "utimeSyncLargeNumberSuccess", // node.js cannot handle such a large value
  "utimeSyncPerm", // permissions
]);
const testFiles = fs.readFileSync("tools/working_test_files.txt", "utf8")
  .trim().split(/\s/);

const testDefinitions = (await import("../src/deno/internal/test.ts"))
  .testDefinitions;

await setupTests();

for (const testFile of testFiles) {
  console.log(`\nRunning tests in ${testFile}...\n`);
  await import("../" + testFile);
  for (const definition of testDefinitions.splice(0)) {
    if (testsToSkip.has(definition.name) || definition.ignore) {
      continue;
    }

    try {
      process.stdout.write(`test ${definition.name} ...`);
      await definition.fn();
      process.stdout.write(" ok\n");
    } catch (err) {
      process.stdout.write("\n");
      process.stdout.write(err.toString() + "\n");
      process.stdout.write("\nfailed");
      process.exit(1);
    }
  }
}

async function setupTests() {
  // set missing CJS globals to dummy values
  // required by Deno.mainModule
  globalThis.require = createRequire(import.meta.url);
  globalThis.__dirname = "";

  // let Deno tests access thirdparty/deno/cli/tests/fixture.json
  process.chdir("thirdparty/deno/");

  await import("../src/global.ts");
}
