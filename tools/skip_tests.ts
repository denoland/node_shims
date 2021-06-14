// rq = requires

export default [
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

  // blob_test
  "blobStream", //TODO, rq: ReadableStream

  // write_file_test
  "writeFileSyncPerm", // permissions
  "writeFilePerm", // permissions
];
