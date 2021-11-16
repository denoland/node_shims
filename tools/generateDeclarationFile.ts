import {
  Diagnostic,
  ExportedDeclarations,
  IndentationText,
  ModuleDeclarationStructure,
  Node,
  Project,
  SourceFile,
  Statement,
  StatementStructures,
  Structure,
  StructureKind,
  SyntaxKind,
  WriterFunction,
} from "./deps.ts";

console.log("Generating declaration file...");
const statements: (StatementStructures | WriterFunction)[] = [];
const declarationProject = getDeclarationProject();

const indexFile = declarationProject.getSourceFileOrThrow(
  "./dist/index.d.ts",
);

// header
statements.push((writer) => {
  writer
    .writeLine(
      `// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.`,
    )
    .blankLine()
    .writeLine(`/// <reference types="node" />`)
    .blankLine()
    .writeLine(`import { URL } from "url";`)
    .writeLine(`import * as undici from "undici";`)
    .writeLine(`import { Blob as BufferBlob } from "buffer";`)
    .blankLine();
});

statements.push(...getMainStatements());

statements.push({
  kind: StructureKind.Module,
  name: `"deno.ns/deno"`,
  statements: (writer) => {
    writer.writeLine("export = Deno;");
  },
});

statements.push({
  kind: StructureKind.Module,
  name: `"deno.ns/global"`,
});

statements.push({
  kind: StructureKind.Module,
  name: `"deno.ns/test-internals"`,
  statements: [
    ...Array.from(
      fileExportsToStructures(declarationProject.getSourceFileOrThrow(
        "./dist/deno/internal/test.d.ts",
      )),
    ).map((s) => exportAndStripAmbient(s)),
  ],
});

// Create a new project with limited declarations and add the declaration
// file to it. Save the file then type check.
const newProject = new Project({
  compilerOptions: {
    // limit to only node types
    types: ["node"],
  },
  tsConfigFilePath: "./tsconfig.json",
  skipAddingFilesFromTsConfig: true,
  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
  },
});
const sourceFile = newProject.createSourceFile(
  "./lib/deno.ns.lib.d.ts",
  { statements },
  { overwrite: true },
);

sourceFile.saveSync();

exitIfDiagnostics(newProject, sourceFile.getPreEmitDiagnostics());

function getMainStatements() {
  const statements: StatementStructures[] = [];

  // add some types from lib.deno.d.ts to make compiling happy
  const denoStableDeclFile = declarationProject.getSourceFileOrThrow(
    "./src/deno/stable/lib.deno.d.ts",
  );
  statements.push(...[
    "EventTarget",
    "Event",
    "EventInit",
    "EventListenerOptions",
    "AddEventListenerOptions",
    "EventListener",
    "EventListenerObject",
    "EventListenerOrEventListenerObject",
  ].map((name) => {
    // todo(dsherret): use Node.hasStructure type guard in next ts-morph release
    return (denoStableDeclFile.getStatementOrThrow((s) =>
      Node.hasName(s) && s.getName() === name
    ) as any).getStructure();
  }));

  // re-export the export declarations from the index file that aren't relative
  for (const exportDecl of indexFile.getExportDeclarations()) {
    if (!exportDecl.getModuleSpecifierValue()?.startsWith("./")) {
      statements.push(exportDecl.getStructure());
    }
  }

  // inline any non-Deno namespace exports in the src directory
  const exportedDeclarations = indexFile.getExportedDeclarations();
  for (const [name, decls] of exportedDeclarations) {
    const isInSrcDir = indexFile.getDirectory()
      .isAncestorOf(decls[0].getSourceFile());
    if (name !== "Deno" && isInSrcDir) {
      statements.push(
        ...Array.from(declsToStructures(name, decls))
          .map((s) => ensureExported(s)),
      );
    }
  }

  statements.push(getDenoNamespace());

  return statements;
}

function getDenoNamespace(): ModuleDeclarationStructure {
  return {
    kind: StructureKind.Module,
    name: "Deno",
    hasDeclareKeyword: true,
    isExported: true,
    statements: [
      ...Array.from(
        fileExportsToStructures(declarationProject.getSourceFileOrThrow(
          "./dist/deno/stable/main.d.ts",
        )),
      ),
      ...Array.from(
        fileExportsToStructures(declarationProject.getSourceFileOrThrow(
          "./dist/deno/unstable/main.d.ts",
        )),
      ),
    ].map((s) => exportAndStripAmbient(s)),
  };
}

function exportAndStripAmbient<TStructure extends StatementStructures>(
  structure: TStructure,
) {
  return ensureExported(stripAmbient(structure));
}

function ensureExported<TStructure extends StatementStructures>(
  structure: TStructure,
) {
  if (Structure.isExportable(structure)) {
    const isInternal = hasRemoveExportKeywordJsDocTag(structure);
    structure.isExported = !isInternal;

    // remove the jsdocs if its internal
    if (isInternal && Structure.isJSDocable(structure)) {
      delete structure.docs;
    }
  }
  return structure;
}

function hasRemoveExportKeywordJsDocTag(structure: StatementStructures) {
  if (!Structure.isJSDocable(structure)) {
    return false;
  }
  if (!structure.docs || !(structure.docs instanceof Array)) {
    return false;
  }

  return structure.docs.some((d) => {
    if (!d || typeof d === "string") {
      return false;
    }
    return d.tags?.some((t) => t.tagName === "removeExportKeyword") ?? false;
  });
}

function stripAmbient<TStructure extends StatementStructures>(
  structure: TStructure,
) {
  if (Structure.isAmbientable(structure)) {
    structure.hasDeclareKeyword = false;
  }
  return structure;
}

function* fileExportsToStructures(file: SourceFile) {
  for (const [name, decls] of file.getExportedDeclarations()) {
    yield* declsToStructures(name, decls);
  }
}

function* declsToStructures(
  name: string,
  decls: (ExportedDeclarations | Statement)[],
) {
  for (const decl of decls) {
    yield* declToStructures(name, decl);
  }
}

function* declToStructures(
  name: string,
  decl: ExportedDeclarations | Statement,
): Iterable<StatementStructures> {
  // Check for a qualified name in a type alias...
  //   export type Alias = Deno.Alias;
  // ...or in a variable declaration...
  //   export const alias: Deno.alias;
  // ...and if so, inline to the original declaration.
  const qualifiedName = decl.asKind(SyntaxKind.TypeAliasDeclaration)
    ?.getTypeNode()
    ?.asKind(SyntaxKind.TypeReference)
    ?.getTypeName() ?? decl.asKind(SyntaxKind.VariableDeclaration)
    ?.getTypeNode()
    ?.asKind(SyntaxKind.TypeQuery)
    ?.getExprName();

  if (Node.hasName(decl) && Node.isQualifiedName(qualifiedName)) {
    const symbol = qualifiedName.getRight().getSymbolOrThrow();
    const declarations = symbol.getDeclarations() as ExportedDeclarations[];
    yield* declsToStructures(name, declarations);
  } else if (Node.isVariableDeclaration(decl)) {
    const varStmt = decl.getVariableStatementOrThrow();
    if (decl.getName() !== name) {
      throw new Error("Unhandled.");
    }
    if (varStmt.getDeclarations().length > 1) {
      throw new Error("Unhandled.");
    }
    yield varStmt.getStructure();
  } else if (Node.isSourceFile(decl)) {
    const statements: StatementStructures[] = [];
    for (const [name, declarations] of decl.getExportedDeclarations()) {
      statements.push(
        ...Array.from(declsToStructures(name, declarations))
          .map(exportAndStripAmbient),
      );
    }
    yield {
      kind: StructureKind.Module,
      name,
      statements,
    };
  } else {
    if (Node.isExpression(decl)) {
      console.error(decl.getFullText());
      throw new Error("Unhandled.");
    }
    if (!Node.hasName(decl) || decl.getName() !== name) {
      throw new Error("Unhandled.");
    }

    // todo(dsherret): use Node.hasStructure in ts-morph in next release
    if (!(decl as any).getStructure) {
      console.error(decl.getFullText());
      throw new Error("Unhandled.");
    }
    yield ((decl as any).getStructure() as StatementStructures);
  }
}

/** Gets a project containing the emitted declaration files. */
function getDeclarationProject() {
  const project = new Project({
    compilerOptions: {
      declaration: true,
    },
    tsConfigFilePath: "./tsconfig.json",
  });

  // exitIfDiagnostics(project, project.getPreEmitDiagnostics());

  const dtsEmitResult = project.emitToMemory({
    emitOnlyDtsFiles: true,
  });

  const declarationProject = new Project({
    tsConfigFilePath: "./tsconfig.json",
    skipAddingFilesFromTsConfig: true,
  });
  for (const item of dtsEmitResult.getFiles()) {
    declarationProject.createSourceFile(item.filePath, item.text, {
      overwrite: true,
    });
  }
  declarationProject.addSourceFileAtPath("./src/deno/stable/lib.deno.d.ts");
  declarationProject.addSourceFileAtPath(
    "./src/deno/unstable/lib.deno.unstable.d.ts",
  );

  return declarationProject;
}

function exitIfDiagnostics(project: Project, diagnostics: Diagnostic[]) {
  if (diagnostics.length > 0) {
    console.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
    console.error(`Had ${diagnostics.length} diagnostic(s).`);
    Deno.exit(1);
  }
}