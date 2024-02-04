// getAccessFlag and getCreationFlag adapted from the original in Rust's std::fs
// <source path="https://github.com/rust-lang/rust/blob/304441960e7058fe97f09ef00b20739b4dc56d11/library/std/src/sys/unix/fs.rs#L694-L728" />

import * as errors from "../stable/variables/errors.js";
import { constants } from "node:fs";
import os from "node:os";

const { O_APPEND, O_CREAT, O_EXCL, O_RDONLY, O_RDWR, O_TRUNC, O_WRONLY } =
  constants;

// deno-lint-ignore ban-types
type Optional<T extends {}> = { [K in keyof T]?: T[K] };

type Opts<T extends string> = Optional<Record<T, boolean>>;

type AccessModes = "read" | "write" | "append";
type CreationModes = "write" | "append" | "create" | "truncate" | "createNew";

export function getAccessFlag(opts: Opts<AccessModes>) {
  if (opts.read && !opts.write && !opts.append) return O_RDONLY;
  if (!opts.read && opts.write && !opts.append) return O_WRONLY;
  if (opts.read && opts.write && !opts.append) return O_RDWR;
  if (!opts.read && opts.append) return O_WRONLY | O_APPEND;
  if (opts.read && opts.append) return O_RDWR | O_APPEND;

  if (!opts.read && !opts.write && !opts.append) {
    throw new errors.BadResource(
      "EINVAL: One of 'read', 'write', 'append' is required to open file.",
    );
  }

  throw new errors.BadResource("EINVAL: Invalid fs flags.");
}

export function getCreationFlag(opts: Opts<CreationModes>) {
  if (!opts.write && !opts.append) {
    if (opts.truncate || opts.create || opts.createNew) {
      throw new errors.BadResource(
        "EINVAL: One of 'write', 'append' is required to 'truncate', 'create' or 'createNew' file.",
      );
    }
  }
  if (opts.append) {
    if (opts.truncate && !opts.createNew) {
      throw new errors.BadResource(
        "EINVAL: unexpected 'truncate': true and 'createNew': false when 'append' is true.",
      );
    }
  }

  if (!opts.create && !opts.truncate && !opts.createNew) return 0;
  if (opts.create && !opts.truncate && !opts.createNew) return O_CREAT;
  if (!opts.create && opts.truncate && !opts.createNew) {
    if (os.platform() === "win32") {
      // for some reason only providing O_TRUNC on windows will
      // throw a "EINVAL: invalid argument", so to work around this
      // we relax the restriction here to also create the file if it
      // doesn't exist
      return O_CREAT | O_TRUNC;
    } else {
      return O_TRUNC;
    }
  }
  if (opts.create && opts.truncate && !opts.createNew) {
    return O_CREAT | O_TRUNC;
  }
  if (opts.createNew) return O_CREAT | O_EXCL;

  throw new errors.BadResource("EINVAL: Invalid fs flags.");
}

export function getFsFlag(flags: Opts<AccessModes | CreationModes>) {
  return getAccessFlag(flags) | getCreationFlag(flags);
}
