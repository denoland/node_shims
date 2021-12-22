export { webcrypto as crypto } from "crypto";
export * as Deno from "./deno.js";
export * from "./util/mod.js";

// TODO: Wait for node builtin WhatWG Streams or fetch-blob to export them without assigning to globalThis
import * as undici from "undici";
import { Blob as BufferBlob } from "buffer";

// fallback to using the global types and values if they exist

/** @removeExportKeyword */
export type GlobalThisPrototypeType<TKey extends string, FallbackType> =
  (typeof globalThis) extends {
    [P in TKey]: {
      prototype: infer T;
    };
  } ? T
    : FallbackType;

/** @removeExportKeyword */
export type GlobalThisType<TKey extends string, FallbackType> =
  (typeof globalThis) extends {
    [P in TKey]: infer T;
  } ? T
    : FallbackType;

export type Blob = GlobalThisPrototypeType<"Blob", BufferBlob>;
export const Blob: GlobalThisType<"Blob", typeof BufferBlob> =
  (globalThis as any)["Blob"] ?? BufferBlob;

export const fetch: GlobalThisType<"fetch", typeof undici.fetch> =
  (globalThis as any)["fetch"] ??
    undici.fetch;

export type File = GlobalThisPrototypeType<"File", undici.File>;
export const File: GlobalThisType<"File", typeof undici.File> =
  (globalThis as any)["File"] ?? undici.File;

export type FormData = GlobalThisPrototypeType<"FormData", undici.FormData>;
export const FormData: GlobalThisType<"FormData", typeof undici.FormData> =
  (globalThis as any)["FormData"] ?? undici.FormData;

export type Headers = GlobalThisPrototypeType<"Headers", undici.Headers>;
export const Headers: GlobalThisType<"Headers", typeof undici.Headers> =
  (globalThis as any)["Headers"] ?? undici.Headers;

export type Request = GlobalThisPrototypeType<"Request", undici.Request>;
export const Request: GlobalThisType<"Request", typeof undici.Request> =
  (globalThis as any)["Request"] ?? undici.Request;

export type Response = GlobalThisPrototypeType<"Response", undici.Response>;
export const Response: GlobalThisType<"Response", typeof undici.Response> =
  (globalThis as any)["Response"] ?? undici.Response;
