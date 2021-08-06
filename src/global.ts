import * as globals from "./index.js";

Object.assign(
  globalThis,
  Object.fromEntries(
    Object.entries(globals).filter(([k]) => !(k in globalThis)),
  ),
);
