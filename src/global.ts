import * as crypto from "crypto";
import fetch, { Headers, Request, Response } from "node-fetch";
import { Deno } from "./index.js";
import { confirm } from "./util/confirm.js";
import { prompt } from "./util/prompt.js";

Object.assign(globalThis, {
  crypto: ((crypto as unknown) as { webcrypto: Crypto }).webcrypto,
  fetch,
  Headers,
  Request,
  Response,
  Deno,
  confirm,
  prompt,
});
