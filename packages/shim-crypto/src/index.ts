// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

import { webcrypto } from "crypto";
import type { Crypto } from "./crypto.types.gen.js";

// At the time of writing this, DefinitelyTyped is missing types for webcrypto for Node.
// The workaround is to just use the types from lib.dom.ts and hope people are
// running unit tests in order to find any issues.
const crypto = webcrypto as unknown as Crypto;

export { crypto };
export * from "./crypto.types.gen.js";
