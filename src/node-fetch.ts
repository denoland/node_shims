///<reference path="./deno/stable/lib.deno.d.ts" />

declare module "node-fetch" {
  export default globalThis.fetch;
  export type Headers = globalThis.Headers;
  export type Request = globalThis.Request;
  export type Response = globalThis.Response;
}
