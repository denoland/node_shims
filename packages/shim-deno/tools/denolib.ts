import { Project } from "../../../scripts/ts_morph.ts";

if (!Deno.version.deno.startsWith("1.29.")) {
  console.error("Wrong Deno version: " + Deno.version.deno);
  Deno.exit(1);
}

const stableTypes = await run("deno types");
const unstableTypes = (await run("deno types --unstable"))
  .replace(stableTypes, "")
  .trimStart();
const version = (await run("deno --version")).trim().split("\n").map((line) =>
  line.split(" ")
).reduce(
  (acc, curr) => ({ ...acc, [curr[0]]: curr[1] }),
  {} as { [k: string]: string },
);

await Deno.writeTextFile(
  `./src/deno/internal/version.ts`,
  [
    `export const deno = "${version.deno}";\n`,
    `export const typescript = "${version.typescript}";\n`,
  ].join(""),
);

await Deno.writeTextFile(
  `./src/deno/stable/lib.deno.d.ts`,
  processDeclsFromStable(processDeclarationFileText(stableTypes)),
);
await Deno.writeTextFile(
  `./src/deno/unstable/lib.deno.unstable.d.ts`,
  processDeclarationFileText(unstableTypes),
);

async function run(cmd: string) {
  return new TextDecoder().decode(
    await Deno.run({
      cmd: cmd.split(" "),
      stdout: "piped",
    }).output(),
  );
}

function processDeclarationFileText(text: string) {
  return text.replace('/// <reference lib="deno.net" />\n', "")
    .replace(
      `/// <reference lib="deno.ns" />`,
      `/// <reference path="../stable/lib.deno.d.ts" />`,
    );
}

function processDeclsFromStable(text: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("deno.lib.d.ts", text);

  // these are removed because they're available in @types/node
  sourceFile.getClassOrThrow("AbortController").remove();
  sourceFile.getInterfaceOrThrow("AbortSignal").remove();
  sourceFile.getInterfaceOrThrow("AbortSignalEventMap").remove();
  sourceFile.getVariableStatementOrThrow("AbortSignal").remove();
  sourceFile
    .getInterfaceOrThrow("ImportMeta")
    .getMethodOrThrow("resolve")
    // make optional to not conflict with @types/node
    .setHasQuestionToken(true);

  // use web streams from @types/node
  [
    "ReadableStream",
    "WritableStream",
    "ReadableStreamBYOBReader",
    "ReadableByteStreamController",
    "UnderlyingSource",
    "UnderlyingByteSource",
    "ReadableStreamBYOBRequest",
    "ReadableByteStreamControllerCallback",
    "ReadableStreamDefaultReadDoneResult",
    "ReadableStreamDefaultReadValueResult",
    "ReadableStreamBYOBReadDoneResult",
    "ReadableStreamBYOBReadValueResult",
    "ReadableStreamDefaultReader",
    "ReadableStreamErrorCallback",
    "ReadableStreamDefaultControllerCallback",
    "ReadableStreamDefaultController",
    "UnderlyingSink",
    "WritableStreamErrorCallback",
    "WritableStreamDefaultControllerCloseCallback",
    "WritableStreamDefaultControllerStartCallback",
    "WritableStreamDefaultControllerWriteCallback",
    "WritableStreamDefaultController",
    "WritableStreamDefaultWriter",
  ].forEach((name) => {
    sourceFile.getInterfaceOrThrow(name).remove();
  });
  [
    "ReadableStreamBYOBReadResult",
    "ReadableStreamDefaultReadResult",
  ].forEach((name) => {
    sourceFile.getTypeAliasOrThrow(name).remove();
  });
  [
    "ReadableStream",
    "ReadableStreamBYOBReader",
    "WritableStream",
    "ReadableStreamDefaultReader",
    "ReadableByteStreamController",
    "ReadableStreamDefaultController",
    "WritableStreamDefaultController",
    "WritableStreamDefaultWriter",
  ].forEach((name) => {
    sourceFile.getVariableStatementOrThrow(name).remove();
  });
  sourceFile.addStatements((writer) => {
    writer.writeLine(
      `type ReadableStream<R = any> = import("node:stream/web").ReadableStream<R>;`,
    );
    writer.write(
      `type WritableStream<W = any> = import("node:stream/web").WritableStream<W>;`,
    );
  });

  return sourceFile.getFullText();
}
