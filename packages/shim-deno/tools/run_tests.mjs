// This script runs the unit tests under third_party/deno directory

import fs from "fs";
import { createRequire } from "module";

// rq = requires
const testsToSkip = new Set([
  // abort_controller_test
  "abortReason", // reason is not supported yet in node.js

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
  "eventTargetAddEventListenerGlobalAbort", // global addEventListener

  // files_test
  "filesIter", // deprecated
  "filesIterCustomBufSize", // deprecated
  "filesIterSync", // deprecated
  "filesIterSyncCustomBufSize", // deprecated
  "fsFileSyncSyncSuccess", // not implemented
  "fsFileSyncSuccess", // not implemented
  "fsFileUtimeSyncSuccess", // not implemented
  "fsFileUtimeSuccess", // not implemented
  "futimeSyncSuccess", // not implemented
  "futimeSuccess", // not implemented
  "readerIter", // deprecated
  "readerIterSync", // deprecated
  "writePermFailure", // permissions
  "openOptions", // todo
  "openMode", // depends on umask
  "openSyncMode", // depends on umask
  "openSyncUrl", // depends on umask
  "openUrl", // depends on umask
  "readPermFailure", // permissions
  "readWritePermFailure", // permissions
  "openSyncNotFound", // includes full path in node.js
  "openNotFound", // includes full path in node.js
  "openModeWriteRead", // not implemented
  "readFileIsDirectoryErrorCode", // todo(https://github.com/denoland/deno/issues/18629): re-enable
  "seekStart", // not implemented
  "seekSyncStart", // not implemented
  "seekCurrent", // not implemented
  "seekStartBigInt", // not implemented
  "seekSyncCurrent", // not implemented
  "seekEnd", // not implemented
  "seekSyncEnd", // not implemented
  "seekMode", // not implemented

  // mkdir_test
  "mkdirMode", // depends on Deno.umask
  "mkdirRecursiveIfExists", // depends on Deno.umask
  "mkdirRecursiveMode", // depends on Deno.umask
  "mkdirSyncMode", // depends on Deno.umask
  "mkdirSyncRecursiveIfExists", // depends on Deno.umask
  "mkdirSyncRecursiveMode", // depends on Deno.umask
  "mkdirSyncErrors", // getCreationFlag throws
  "mkdirSyncPerm", // permissions

  // os_test
  "envPermissionDenied1", // permissions
  "envPermissionDenied2", // permissions
  "envCaseInsensitive", // needs Deno.Command
  "osPpidIsEqualToPidOfParentProcess", // needs Deno.Command
  "execPathPerm", // permissions
  "loadavgPerm", // permissions
  "hostnameWithoutOtherNetworkUsages", // needs Deno.Command
  "hostnamePerm", // permissions
  "releasePerm", // permissions
  "osUptimePerm", // permissions
  "systemMemoryInfo", // not implemented
  "getUid", // not implemented
  "getGid", // not implemented

  // process_test
  "runPermissions", // permissions
  "killPermissions", // permissions
  "uid", // permissions
  "gid", // permissions

  // stat_test
  "statSyncPerm", // permissions
  "statSyncNotFound", // todo: includes full path in node.js
  "lstatSyncPerm", // permissions
  "lstatSyncNotFound", // todo: includes full path in node.js
  "statPerm", // permissions
  "statNotFound", // todo: includes full path in node.js
  "lstatPerm", // permissions
  "lstatNotFound", // todo: includes full path in node.js

  // read_file_test
  "readFileSyncPerm", // permissions
  "readFilePerm", // permissions
  "readFileDoesNotLeakResources", //TODO, rq: Deno.resources
  "readFileSyncDoesNotLeakResources", //TODO, rq: Deno.resources
  "readFileWithAbortSignal", //TODO, rq: issue #64
  "readFileWithAbortSignalReason", //TODO, rq: issue #64
  "readFileWithAbortSignalPrimitiveReason", //TODO, rq: issue #64

  // read_text_file_test
  "readTextFileSyncPerm", // permissions
  "readTextFilePerm", // permissions
  "readTextFileDoesNotLeakResources", //TODO, rq: Deno.resources
  "readTextFileSyncDoesNotLeakResources", //TODO, rq: Deno.resources
  "readTextFileWithAbortSignal", //TODO, rq: issue #64
  "readTextFileWithAbortSignalReason", //TODO, rq: issue #64
  "readTextFileWithAbortSignalPrimitiveReason", //TODO, rq: issue #64
  "readTextFileSyncV8LimitError", // edge case
  "readTextFileV8LimitError", // edge case

  // read_dir_test
  "readDirSyncPerm", // permissions
  "readDirPerm", // permissions

  // testing_test
  "invalidStepArguments", // no test runner in shim-deno
  "nameOnTextContext", // no test runner in shim-deno
  "originOnTextContext", // no test runner in shim-deno
  "parentOnTextContext", // no test runner in shim-deno

  // timers_test
  "clearTimeoutShouldConvertToNumber", // Timeout is an object, not a number
  "clearTimeoutShouldThrowWithBigint", // Timeout is an object, not a number
  "callbackTakesLongerThanInterval", // Deno.sleepSync works differently than Atomics.wait unfortunately
  "sleepSyncShorterPromise", // Deno.sleepSync works differently than Atomics.wait unfortunately
  "sleepSyncLongerPromise", // Deno.sleepSync works differently than Atomics.wait unfortunately
  "AbortSignal.timeout() with listeners", // can't use execCode
  "AbortSignal.timeout() with removed listeners", // can't use execCode
  "AbortSignal.timeout() with no listeners", // Deno.Command is not implemented yet
  "AbortSignal.timeout() with listener for a non-abort event", // Deno.Command is not implemented yet
  "evalPrimordial", // Timeout is an object, not a number
  "unrefTimer", // can't use execCode
  "unrefTimer - mix ref and unref 1", // can't use execCode
  "unrefTimer - mix ref and unref 2", // can't use execCode
  "unrefTimer - unref interval", // can't use execCode
  "unrefTimer - unref then ref 1", // can't use execCode
  "unrefTimer - unref then ref", // can't use execCode
  "unrefTimer - invalid calls do nothing", // todo: add unrefTimer
  "timerMaxCpuBug", // uses metrics
  "stringifyAndEvalNonFunctions",
  "testFunctionParamsLength",
  "timeoutBindThis",
  "timeoutCallbackThis",
  "timeoutEvalNoScopeLeak",
  "regression for #20367", // interestingly, node.js seems flaky on this

  // truncate_test
  "truncateSyncPerm", // permissions
  "truncatePerm", // permissions

  // url_test
  "customInspectFunction",
  "emptyUrl", // deno includes more details in the error messages
  "urlHostnameParsing", // failing only on ci for some reason
  "urlDriveLetter",
  "urlPathRepeatedSlashes",
  "urlProtocolParsing", // deno includes more details in the error messages

  // write_file_test
  "writeFileAbortSignalPreAborted", // implementation detail
  "writeFileSyncPerm", // permissions
  "writeFilePerm", // permissions
  "writeFileAbortSignalReason", // TODO, rq: issue #65
  "writeFileAbortSignalPrimitiveReason", // TODO, rq: issue #65
  "writeFileAbortSignalReasonPreAborted", // TODO, rq: issue #65
  "writeFileAbortSignalPrimitiveReasonPreAborted", // TODO, rq: issue #65

  // write_text_file_test
  "writeTextFileSyncPerm", // permissions
  "writeTextFilePerm", // permissions

  // utime_test
  "utimeSyncLargeNumberSuccess", // node.js cannot handle such a large value
  "utimeSyncPerm", // permissions
]);
const testFiles = fs.readFileSync("tools/working_test_files.txt", "utf8")
  .trim().split(/\s/);

const testDefinitions = (await import("../src/test-internals.ts"))
  .testDefinitions;
const filter = getFilter();

await setupTests();

for (const testFile of testFiles) {
  await import("../" + testFile);
  const definitions = testDefinitions.splice(0)
    .filter((definition) => {
      if (testsToSkip.has(definition.name) || definition.ignore) {
        return false;
      }
      if (filter && !definition.name.includes(filter)) {
        return false;
      }

      return true;
    });

  if (definitions.length === 0) {
    continue;
  }

  console.log(`\nRunning tests in ${testFile}...\n`);

  for (const definition of definitions) {
    try {
      process.stdout.write(`test ${definition.name} ...`);
      await definition.fn();
      process.stdout.write(" ok\n");
    } catch (err) {
      process.stdout.write("\n");
      process.stdout.write((err.stack ?? err).toString() + "\n");
      process.stdout.write("\nfailed\n");
      process.exit(1);
    }
  }
}

function getFilter() {
  const args = process.argv.slice(2);
  const filterIndex = args.indexOf("--filter");
  return filterIndex >= 0 ? args[filterIndex + 1] : undefined;
}

async function setupTests() {
  // set missing CJS globals to dummy values
  // required by Deno.mainModule
  globalThis.require = createRequire(import.meta.url);
  globalThis.__dirname = "";

  // let Deno tests access third_party/deno/cli/tests/fixture.json
  process.chdir("third_party/deno/");

  globalThis.Deno = (await import("../src/index.ts")).Deno;
  if (!("Blob" in globalThis)) {
    globalThis.Blob = (await import("buffer")).Blob;
  }
  await webStreamHack();

  if (!("crypto" in globalThis)) {
    globalThis.crypto = (await import("crypto")).webcrypto;
  }

  if (Promise.withResolvers === undefined) {
    // https://github.com/tc39/proposal-promise-with-resolvers/blob/3a78801e073e99217dbeb2c43ba7212f3bdc8b83/polyfills.js#L1C1-L9C2
    Promise.withResolvers = () => {
      const out = {};
      out.promise = new Promise((resolve_, reject_) => {
        out.resolve = resolve_;
        out.reject = reject_;
      });
      return out;
    };
  }
}

async function webStreamHack() {
  // https://github.com/node-fetch/fetch-blob/blob/c5c2b5215446334bf496733d4cdb48a981b4c440/streams.cjs
  // 64 KiB (same size chrome slice theirs blob into Uint8array's)
  const POOL_SIZE = 65536;

  try {
    if (!globalThis.ReadableStream) {
      Object.assign(globalThis, await import("stream/web"));
    }
    const { Blob } = await import("buffer");
    if (Blob && !Blob.prototype.stream) {
      Blob.prototype.stream = function name() {
        let position = 0;
        //deno-lint-ignore no-this-alias
        const blob = this;

        return new ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = blob.slice(
              position,
              Math.min(blob.size, position + POOL_SIZE),
            );
            const buffer = await chunk.arrayBuffer();
            position += buffer.byteLength;
            ctrl.enqueue(new Uint8Array(buffer));

            if (position === blob.size) {
              ctrl.close();
            }
          },
        });
      };
    }
  } catch (_error) {
    // ignore
  }
}
