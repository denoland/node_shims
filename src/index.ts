export { Blob } from "buffer";
export { webcrypto as crypto } from "crypto";
// TODO: Wait for node builtin WhatWG Streams or fetch-blob to export them without assigning to globalThis
export { fetch, File, FormData, Headers, Request, Response } from "undici";
export * as Deno from "./deno.js";
export { alert } from "./util/alert.js";
export { confirm } from "./util/confirm.js";
export { prompt } from "./util/prompt.js";
