// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

import {
  ClassDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  Node,
  StatementStructures,
  Structure,
  Symbol,
  TypeAliasDeclaration,
  VariableStatement,
} from "./ts_morph.ts";

export function extractTypesFromSymbol(opts: {
  symbol: Symbol;
  /** If this declaration should be included and analyzed. */
  isContainedDeclaration: (node: Node) => boolean;
}) {
  const visitedSymbols = new Set<Symbol>();
  const visitedNodes = new Set<Node>();
  const statements: (StatementStructures | string)[] = [];

  visitSymbol(opts.symbol);

  return statements;

  function visitSymbol(symbol: Symbol) {
    if (visitedSymbols.has(symbol)) {
      return;
    }
    visitedSymbols.add(symbol);

    for (const declaration of symbol.getDeclarations()) {
      if (
        !opts.isContainedDeclaration(declaration) ||
        visitedNodes.has(declaration)
      ) {
        continue;
      }

      visitedNodes.add(declaration);

      if (
        Node.isInterfaceDeclaration(declaration) ||
        Node.isTypeAliasDeclaration(declaration) ||
        Node.isClassDeclaration(declaration) ||
        Node.isFunctionDeclaration(declaration)
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
        | ClassDeclaration
        | FunctionDeclaration,
    ) {
      const structure = declaration.getStructure();
      structure.isExported = true;
      if (Structure.isFunctionDeclarationOverload(structure)) {
        throw new Error("Not implemented.");
      }

      if (Structure.isFunction(structure)) {
        structure.hasDeclareKeyword = true;
      }
      statements.push(structure);
    }
  }
}
