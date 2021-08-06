export { Blob } from "buffer";
export { webcrypto as crypto } from "crypto";
// TODO: Wait for node builtin WhatWG Streams or fetch-blob to export them without assigning to globalThis
export { default as fetch, Headers, Request, Response } from "node-fetch";
export { URL } from "url";
export * as Deno from "./deno.js";
export { confirm } from "./util/confirm.js";
export { prompt } from "./util/prompt.js";
export { FormData };
import * as FormData from "form-data";
