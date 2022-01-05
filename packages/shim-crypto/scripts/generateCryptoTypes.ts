// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

import {
  ClassDeclaration,
  IndentationText,
  InterfaceDeclaration,
  Node,
  Project,
  StatementStructures,
  Symbol,
  TypeAliasDeclaration,
  VariableStatement,
} from "https://deno.land/x/ts_morph@13.0.2/mod.ts";

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

const visitedSymbols = new Set<Symbol>();
const visitedNodes = new Set<Node>();
const crypto = domDtsFile.getInterfaceOrThrow("Crypto");

visitSymbol(crypto.getSymbolOrThrow());

project.createSourceFile(
  "./src/crypto.types.gen.ts",
  { statements },
  { overwrite: true },
).saveSync();

function visitSymbol(symbol: Symbol) {
  if (visitedSymbols.has(symbol)) {
    return;
  }
  visitedSymbols.add(symbol);

  for (const declaration of symbol.getDeclarations()) {
    if (
      declaration.getSourceFile() !== domDtsFile ||
      visitedNodes.has(declaration)
    ) {
      continue;
    }

    visitedNodes.add(declaration);

    if (
      Node.isInterfaceDeclaration(declaration) ||
      Node.isTypeAliasDeclaration(declaration) ||
      Node.isClassDeclaration(declaration)
    ) {
      writeDeclaration(declaration);
    } else if (Node.isVariableDeclaration(declaration)) {
      writeDeclaration(declaration.getVariableStatementOrThrow());
    }

    for (const descendant of declaration.getDescendants()) {
      const symbol = descendant.getSymbol();
      if (symbol != null) {
        visitSymbol(symbol);
      }
    }
  }

  function writeDeclaration(
    declaration:
      | VariableStatement
      | InterfaceDeclaration
      | TypeAliasDeclaration
      | ClassDeclaration,
  ) {
    const structure = declaration.getStructure();
    structure.isExported = true;
    statements.push(structure);
  }
}
