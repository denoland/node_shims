// rq = requires

exports.testsToSkip = new Set([
  // blob_test
  "blobBuffer", // experimental native Blob
  "blobCustomInspectFunction", // experimental native Blob

  // copy_file_test
  "copyFileSyncPerm1", // permissions
  "copyFileSyncPerm2", // permissions
  "copyFilePerm1", // permissions
  "copyFilePerm2", // permissions

  // dir_test
  "dirCwdPermError", // permissions

  // mkdir_test
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

  // truncate_test
  "truncateSyncPerm", // permissions
  "truncatePerm", // permissions

  // write_file_test
  "writeFileAbortSignalPreAborted", // implementation detail
  "writeFileSyncPerm", // permissions
  "writeFilePerm", // permissions

  // write_text_file_test
  "writeTextFileSyncPerm", // permissions
  "writeTextFilePerm", // permissions
]);
