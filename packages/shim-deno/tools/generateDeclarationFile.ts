import {
  ExportedDeclarations,
  IndentationText,
  ModuleDeclarationKind,
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
} from "../../../scripts/ts_morph.ts";
import { exitIfDiagnostics } from "../../../scripts/helpers.ts";
import { ensureSpecificDenoVersion } from "./deno_version.ts";

ensureSpecificDenoVersion();

console.log("Generating declaration file...");
const statements: (StatementStructures | WriterFunction)[] = [];
const declarationProject = getDeclarationProject();

const indexFile = declarationProject.getSourceFileOrThrow(
  `./dist/script/index.d.ts`,
);

// header
statements.push((writer) => {
  writer
    .writeLine(
      `// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.`,
    )
    .blankLine()
    .writeLine(`/// <reference types="node" />`)
    .blankLine()
    .writeLine(`import { URL } from "url";`)
    .writeLine(
      `import { ReadableStream, WritableStream } from "stream/web";`,
    )
    .blankLine();
});

statements.push(...getMainStatements());

statements.push({
  kind: StructureKind.Module,
  name: `"@deno/shim-deno/test-internals"`,
  statements: [
    {
      // to make the code below compile
      kind: StructureKind.TypeAlias,
      name: "TestDefinition",
      type: "Deno.TestDefinition",
    },
    ...Array.from(
      fileExportsToStructures(
        declarationProject.getSourceFileOrThrow(
          `./dist/script/test-internals.d.ts`,
        ),
      ),
    ).map((s) => exportAndStripAmbient(s)),
  ],
});
statements.push({
  kind: StructureKind.Module,
  declarationKind: ModuleDeclarationKind.Global,
  name: "global",
  hasDeclareKeyword: true,
  statements: [{
    kind: StructureKind.Interface,
    name: "SymbolConstructor",
    properties: [{
      isReadonly: true,
      name: "asyncDispose",
      type: "unique symbol",
    }, {
      isReadonly: true,
      name: "dispose",
      type: "unique symbol",
    }],
  }],
});
// fix up the MessagePort reference
statements.push({
  kind: StructureKind.TypeAlias,
  name: "MessagePort",
  type: `typeof globalThis["MessagePort"]`,
});

// Create a new project with limited declarations and add the declaration
// file to it. Save the file then type check.
const newProject = new Project({
  compilerOptions: {
    lib: ["lib.esnext.d.ts"],
    // limit to only node types
    types: ["node"],
  },
  tsConfigFilePath: `./tsconfig.json`,
  skipAddingFilesFromTsConfig: true,
  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
  },
});
const sourceFile = newProject.createSourceFile(
  `./lib/shim-deno.lib.d.ts`,
  { statements },
  { overwrite: true },
);

sourceFile.saveSync();
sourceFile.copyImmediatelySync(`./dist/index.d.cts`, { overwrite: true });
sourceFile.copyImmediatelySync(`./dist/index.d.mts`, { overwrite: true });

exitIfDiagnostics(newProject, sourceFile.getPreEmitDiagnostics());

// create the internal declaration
console.log("Generating internal test declaration file...");
const testInternalFile = newProject.addSourceFileAtPath(
  "src/test-internals.ts",
);
newProject.compilerOptions.set({
  declaration: true,
});
const files = newProject.emitToMemory({
  emitOnlyDtsFiles: true,
  targetSourceFile: testInternalFile,
}).getFiles();
if (files.length !== 1) {
  throw new Error("Failed. Should have only generated one file.");
}
Deno.writeTextFileSync("./dist/test-internals.d.cts", files[0].text);
Deno.writeTextFileSync("./dist/test-internals.d.mts", files[0].text);

function getMainStatements() {
  const statements: StatementStructures[] = [];

  // add some types from lib.deno.d.ts to make compiling happy
  const denoStableDeclFile = declarationProject.getSourceFileOrThrow(
    `./src/deno/stable/lib.deno.d.ts`,
  );
  statements.push(
    ...[
      "EventListenerOptions",
      "AddEventListenerOptions",
      "EventListener",
      "EventListenerObject",
      "EventListenerOrEventListenerObject",
      "Disposable",
      "AsyncDisposable",
    ].map((name) => {
      const statements = denoStableDeclFile
        .getStatements()
        .filter((s) =>
          Node.hasName(s) && s.getName() === name ||
          Node.isVariableStatement(s) &&
            s.getDeclarations().some((d) => d.getName() === name)
        );
      if (statements.length === 0) {
        throw new Error(`Not found: ${name}`);
      }
      return statements.map((statement) => {
        if (!Node.hasStructure(statement)) {
          throw new Error("Unhandled");
        }
        return statement.getStructure() as StatementStructures;
      });
    }).flat(),
  );

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
          `./dist/script/deno/stable/main.d.ts`,
        )),
      ),
    ].map((s) => exportAndStripAmbient(s)),
  };
}

function exportAndStripAmbient<TStructure>(structure: TStructure) {
  return ensureExported(stripAmbient(structure));
}

function ensureExported<TStructure>(structure: TStructure) {
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

function hasRemoveExportKeywordJsDocTag(structure: unknown) {
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

function stripAmbient<TStructure>(structure: TStructure) {
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
      console.error(decl.getFullText());
      throw new Error("Unhandled.");
    }

    if (Node.hasStructure(decl)) {
      yield decl.getStructure() as StatementStructures;
    } else {
      console.error(decl.getFullText());
      throw new Error("Unhandled.");
    }
  }
}

/** Gets a project containing the emitted declaration files. */
function getDeclarationProject() {
  const project = new Project({
    compilerOptions: {
      declaration: true,
    },
    tsConfigFilePath: `./tsconfig.json`,
  });

  exitIfDiagnostics(project, project.getPreEmitDiagnostics());

  const dtsEmitResult = project.emitToMemory({
    emitOnlyDtsFiles: true,
  });

  const declarationProject = new Project({
    tsConfigFilePath: `./tsconfig.json`,
    skipAddingFilesFromTsConfig: true,
  });
  for (const item of dtsEmitResult.getFiles()) {
    declarationProject.createSourceFile(item.filePath, item.text, {
      overwrite: true,
    });
  }
  declarationProject.addSourceFileAtPath(
    `./src/deno/stable/lib.deno.d.ts`,
  );

  return declarationProject;
}
