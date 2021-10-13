#!/usr/bin/env -S deno run --allow-read --allow-run
// This script runs the unit tests under thirdparty/deno directory

// rq = requires
const testsToSkip = [
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
];
const skipFilter = `/^(?!${testsToSkip.join("$|")}$)/`;
const testFiles = (await Deno.readTextFile("tools/working_test_files.txt"))
  .trim().split(/\s/);

const cmd = [
  "node",
  "./node_modules/@fromdeno/test/src/cli.mjs",
  `--filter=${skipFilter}`,
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
