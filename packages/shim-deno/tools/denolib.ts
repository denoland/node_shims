// not sure why, but I needed to add this
/// <reference lib="deno.ns" />

import { Node, Project } from "../../../scripts/ts_morph.ts";
import { ensureSpecificDenoVersion } from "./deno_version.ts";

ensureSpecificDenoVersion();

const stableTypes = await run("deno types");
const version = (await run("deno --version")).trim().split("\n").map((
  line: string,
) => line.split(" ")).reduce(
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

async function run(cmd: string) {
  const parts = cmd.split(" ");
  return new TextDecoder().decode(
    (await new Deno.Command(parts[0], {
      args: parts.slice(1),
    }).output()).stdout,
  );
}

function processDeclarationFileText(text: string) {
  return text.replace('/// <reference lib="deno.net" />\n', "")
    .replace(`/// <reference no-default-lib="true" />\n`, "")
    .replace(
      `/// <reference lib="deno.ns" />`,
      `/// <reference path="../stable/lib.deno.d.ts" />`,
    ).replace(`/// <reference lib="esnext" />\n`, "")
    .replace(`/// <reference lib="esnext.disposable" />\n`, "");
}

function processDeclsFromStable(text: string) {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("deno.lib.d.ts", text);

  // these are removed because they're available in @types/node
  sourceFile.getVariableStatementOrThrow("AbortController").remove();
  sourceFile.getInterfaceOrThrow("AbortController").remove();
  sourceFile.getInterfaceOrThrow("AbortSignal").remove();
  sourceFile.getInterfaceOrThrow("AbortSignalEventMap").remove();
  sourceFile.getVariableStatementOrThrow("AbortSignal").remove();

  [
    // use web streams from @types/node
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
    "ReadableStreamBYOBReadResult",
    "ReadableStreamDefaultReadResult",
    // use fetch types from @types/node
    "Blob",
    "FormData",
    "Headers",
    "Response",
    "Request",
    "RequestInit",
    "URLSearchParams",
    "URL",
    // use from @types/node
    "BroadcastChannel",
    "Event",
    "EventTarget",
    "MessageChannel",
    "MessagePort",
    "TextDecoder",
    "TextEncoder",
    "performance",
  ].forEach((name) => {
    const statements = sourceFile.getStatements().filter((s) => {
      return Node.hasName(s) && s.getName() === name ||
        Node.isVariableStatement(s) &&
          s.getDeclarations().some((d) => d.getName() === name);
    });
    if (statements.length === 0) {
      throw new Error(`Not found: ${name}`);
    }
    statements.forEach((s) => s.remove());
  });
  sourceFile.addStatements((writer) => {
    writer.writeLine(
      `type ReadableStream<R = any> = import("stream/web").ReadableStream<R>;`,
    );
    writer.writeLine(
      `type WritableStream<W = any> = import("stream/web").WritableStream<W>;`,
    );
    writer.write("interface AsyncDisposable").block(() => {
      writer.write("[Symbol.asyncDispose](): PromiseLike<void>;");
    }).newLine();
    writer.write("interface Disposable").block(() => {
      writer.write("[Symbol.dispose](): void;");
    });
    writer.write("interface SymbolConstructor").block(() => {
      writer.writeLine("readonly dispose: unique symbol;");
      writer.writeLine("readonly asyncDispose: unique symbol;");
    });
    writer.write("interface ErrorOptions").block(() => {
      writer.writeLine("cause?: unknown;");
    });
    writer.writeLine(`type MessagePort = typeof globalThis["MessagePort"];`);
  });

  return sourceFile.getFullText();
}
