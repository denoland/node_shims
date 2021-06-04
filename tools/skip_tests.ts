// rq = requires

export default [
  // read_file_test
  "readFileSyncPerm",
  "readFilePerm",
  "readFileDoesNotLeakResources", //TODO, rq: Deno.resources
  "readFileSyncDoesNotLeakResources", //TODO, rq: Deno.resources

  // read_text_file_test
  "readTextFileSyncPerm",
  "readTextFilePerm",
  "readTextFileDoesNotLeakResources", //TODO, rq: Deno.resources
  "readTextFileSyncDoesNotLeakResources", //TODO, rq: Deno.resources

  // read_dir_test
  "readDirSyncPerm",
  "readDirPerm",

  // blob_test
  "blobStream", //TODO, rq: ReadableStream
];
