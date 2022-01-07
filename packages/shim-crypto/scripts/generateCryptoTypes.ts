// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

import { extractTypesFromSymbol } from "../../../scripts/extract_types_from_symbol.ts";
import {
  IndentationText,
  Project,
  StatementStructures,
} from "../../../scripts/ts_morph.ts";

/// Analyzes lib.dom.d.ts and extracts out all the types used by the `Crypto` interface.
const project = new Project({
  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
  },
});
const domDtsFile = project.addSourceFileAtPath(
  "../shim-deno/third_party/deno/cli/dts/lib.dom.d.ts",
);
const statements: (StatementStructures | string)[] = [];
statements.push("// deno-lint-ignore-file");
statements.push("// deno-fmt-ignore-file");
statements.push(
  "// DO NOT EDIT - This file is automatically maintained by `npm run generate-crypto-types`",
);

const crypto = domDtsFile.getInterfaceOrThrow("Crypto");

statements.push(...extractTypesFromSymbol({
  symbol: crypto.getSymbolOrThrow(),
  isContainedDeclaration: (node) => node.getSourceFile() === domDtsFile,
}));

project.createSourceFile(
  "./src/crypto.types.gen.ts",
  { statements },
  { overwrite: true },
).saveSync();
