# `deno.ns`

[`Deno` namespace](https://doc.deno.land/builtin/stable) shim for Node.js.

See
[PROGRESS.md](https://github.com/denoland/deno.ns/blob/main/packages/deno.ns/PROGRESS.md)

## Usage

```js
const {
  Blob,
  crypto,
  Deno,
  fetch,
  File,
  FormData,
  Headers,
  Request,
  Response,
} = require("deno.ns");
```

or `node --require=deno.ns/global <denoBundleOutput>`,

or https://github.com/wojpawlik/deno2node#shimming

## Acknowledgements

Special thanks to the [@fromdeno](https://github.com/fromdeno) organization for
starting this project and for their contributions—specifically
[@wojpawlik](https://github.com/wojpawlik),
[@MKRhere](https://github.com/MKRhere), and
[@trgwii](https://github.com/trgwii).
