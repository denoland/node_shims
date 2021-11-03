export { Blob } from "buffer";
export { webcrypto as crypto } from "crypto";
export * as Deno from "./deno.js";
export { alert } from "./util/alert.js";
export { confirm } from "./util/confirm.js";
export { prompt } from "./util/prompt.js";

// TODO: Wait for node builtin WhatWG Streams or fetch-blob to export them without assigning to globalThis
import * as undici from "undici";

// fallback to using the global types and values if they exist
export const fetch: (typeof globalThis) extends { "fetch": infer T } ? T
  : typeof undici.fetch = (globalThis as any)["fetch"] ??
    undici.fetch;

export type File = (typeof globalThis) extends { "File": infer T } ? T
  : undici.File;
export const File: File = (globalThis as any)["File"] ?? undici.File;

export type FormData = (typeof globalThis) extends { "FormData": infer T } ? T
  : undici.FormData;
export const FormData: FormData = (globalThis as any)["FormData"] ??
  undici.FormData;

export type Headers = (typeof globalThis) extends { "Headers": infer T } ? T
  : undici.Headers;
export const Headers: Headers = (globalThis as any)["Headers"] ??
  undici.Headers;

export type Request = (typeof globalThis) extends
  { "Request": { prototype: infer T } } ? T
  : undici.Request;
export const Request: Request = (globalThis as any)["Request"] ??
  undici.Request;

export type Response = (typeof globalThis) extends
  { "Response": { prototype: infer T } } ? T
  : undici.Response;
export const Response: Response = (globalThis as any)["Response"] ??
  undici.Response;
