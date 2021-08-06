import * as globals from "./index.js";
// Adds WhatWG Streams to globalThis
require("fetch-blob/streams.cjs");

Object.assign(
  globalThis,
  Object.fromEntries(
    Object.entries(globals).filter(([k]) => !(k in globalThis)),
  ),
);
