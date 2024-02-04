// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

import {
  exitIfDiagnostics,
  extractTypesFromSymbol,
  tsMorph,
} from "../../../scripts/mod.ts";

/// Analyzes lib.deno.ns.d.ts and extracts out all the types used by Deno.test
const project = new tsMorph.Project({
  manipulationSettings: {
    indentationText: tsMorph.IndentationText.TwoSpaces,
  },
});
const libDenoFile = project.addSourceFileAtPath(
  "../shim-deno/third_party/deno/cli/tsc/dts/lib.deno.ns.d.ts",
);
const statements: (tsMorph.StatementStructures | string)[] = [];
statements.push("// deno-lint-ignore-file");
statements.push("// deno-fmt-ignore-file");
statements.push(
  "// DO NOT EDIT - This file is automatically maintained by `npm run generate-deno-types`",
);
statements.push(`import { URL } from "node:url";`);

const denoNs = libDenoFile.getModuleOrThrow("Deno");
const testFunc = denoNs.getVariableDeclarationOrThrow("test");

statements.push(...extractTypesFromSymbol({
  symbol: testFunc.getSymbolOrThrow(),
  isContainedDeclaration: (node) => {
    if (tsMorph.Node.isModuleDeclaration(node) && node.getName() === "Deno") {
      return false;
    }
    if (tsMorph.Node.isFunctionDeclaration(node) && node.getName() === "exit") {
      return false;
    }

    const inDeclFile = node.getSourceFile() === libDenoFile;
    return inDeclFile;
  },
}));

for (const statement of statements) {
  if (tsMorph.Structure.isVariableStatement(statement)) {
    statement.hasDeclareKeyword = true;
  }
}

const outputFile = project.createSourceFile(
  "./src/deno.types.gen.d.ts",
  { statements },
  { overwrite: true },
);
outputFile.saveSync();

exitIfDiagnostics(
  project,
  project.getPreEmitDiagnostics()
    .filter((d) => d.getSourceFile() === outputFile),
);
