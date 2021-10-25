/// <reference path="../lib.deno.d.ts" />

import childProcess from "child_process";
import fs from "fs";
import os from "os";
import url from "url";
import { once } from "events";
import which from "which";

import { BufferStreamReader, StreamWriter } from "../../internal/streams.js";
import * as errors from "../variables/errors.js";
import { RunOptions } from "../types.js";

type SignalName = keyof typeof os.constants.signals;

type UnstableRunOptions = RunOptions & {
  clearEnv?: boolean;
  gid?: number;
  uid?: number;
};

export const run: typeof Deno.run = function run<
  T extends UnstableRunOptions = UnstableRunOptions,
>(options: T) {
  const [cmd, ...args] = options.cmd;

  // childProcess.spawn will asynchronously check if the command exists, but
  // we need to do this synchronously
  const commandName = getCmd(cmd);
  if (!which.sync(commandName, { nothrow: true })) {
    throw new errors.NotFound("The system cannot find the file specified.");
  }

  const process = childProcess.spawn(commandName, args as string[], {
    cwd: options.cwd,
    env: getEnv(options),
    uid: options.uid,
    gid: options.gid,
    shell: false,
    stdio: [
      getStdio(options.stdin, "in"),
      getStdio(options.stdout, "out"),
      getStdio(options.stderr, "out"),
    ],
  });
  return new Process<T>(process);
};

function getStdio(
  value: Deno.RunOptions["stdout"] | undefined,
  kind: "in" | "out",
): childProcess.StdioPipe | childProcess.StdioNull {
  if (value === "inherit" || value == null) {
    return "inherit" as const; // default
  } else if (value === "piped") {
    return "pipe" as const;
  } else if (value === "null") {
    return "ignore" as const;
  } else if (typeof value === "number") {
    switch (kind) {
      case "in":
        // deno-lint-ignore no-explicit-any
        return fs.createReadStream(null as any, { fd: value });
      case "out":
        // deno-lint-ignore no-explicit-any
        return fs.createWriteStream(null as any, { fd: value });
      default: {
        const _assertNever: never = kind;
        throw new Error("Unreachable.");
      }
    }
  } else {
    const _assertNever: never = value;
    throw new Error("Unknown value.");
  }
}

function getCmd(firstArg: string | URL) {
  if (firstArg instanceof URL) {
    return url.fileURLToPath(firstArg);
  } else {
    return firstArg;
  }
}

function getEnv(options: UnstableRunOptions) {
  const env = options.env ?? {};
  for (const name in process.env) {
    if (!Object.prototype.hasOwnProperty.call(env, name)) {
      env[name] = options.clearEnv ? "" : process.env[name]!;
    }
  }
  return env;
}

export class Process<T extends Deno.RunOptions = Deno.RunOptions>
  implements Deno.Process<T> {
  readonly #process: childProcess.ChildProcess;
  readonly #stderr: ProcessReadStream | null;
  readonly #stdout: ProcessReadStream | null;
  readonly #stdin: ProcessWriteStream | null;
  readonly #status;
  #receivedStatus = false;

  /** @internal */
  constructor(process: childProcess.ChildProcess) {
    this.#process = process;
    this.#stdout = ProcessReadStream.fromNullable(this.#process.stdout) ?? null;
    this.#stderr = ProcessReadStream.fromNullable(this.#process.stderr) ?? null;
    this.#stdin = ProcessWriteStream.fromNullable(this.#process.stdin) ?? null;
    this.#status = once(process, "exit");
  }

  get rid(): number {
    // todo: useful to return something?
    return NaN;
  }

  get pid(): number {
    // only undefined when the process doesn't spawn, in which case this
    // will never be reached
    return this.#process.pid!;
  }

  get stdin() {
    return this.#stdin as Deno.Process<T>["stdin"];
  }

  get stdout() {
    return this.#stdout as Deno.Process<T>["stdout"];
  }

  get stderr() {
    return this.#stderr as Deno.Process<T>["stderr"];
  }

  async status() {
    const [code, signalName] = await this.#status as [number, SignalName];
    const signal = os.constants.signals[signalName];
    const success = code === 0;
    this.#receivedStatus = true;
    return { code, signal, success } as Deno.ProcessStatus;
  }

  output(): Promise<Uint8Array> {
    if (!this.#stdout) {
      throw new TypeError("stdout was not piped");
    }
    return this.#stdout.readAll();
  }

  stderrOutput(): Promise<Uint8Array> {
    if (!this.#stderr) {
      throw new TypeError("stderr was not piped");
    }
    return this.#stderr.readAll();
  }

  close(): void {
    this.#process.kill();
  }

  kill(signo: string) {
    if (this.#receivedStatus) {
      throw new errors.NotFound("entity not found");
    }

    this.#process.kill(signo as NodeJS.Signals);
  }
}

class ProcessReadStream implements Deno.Reader, Deno.Closer {
  readonly #stream: NonNullable<childProcess.ChildProcess["stdout"]>;
  readonly #bufferStreamReader: BufferStreamReader;

  constructor(stream: NonNullable<childProcess.ChildProcess["stdout"]>) {
    this.#stream = stream;
    this.#bufferStreamReader = new BufferStreamReader(stream);
  }

  static fromNullable(stream: childProcess.ChildProcess["stdout"]) {
    return stream ? new ProcessReadStream(stream) : undefined;
  }

  readAll() {
    return this.#bufferStreamReader.readAll();
  }

  read(p: Uint8Array) {
    return this.#bufferStreamReader.read(p);
  }

  close() {
    this.#stream.destroy();
  }
}

class ProcessWriteStream implements Deno.Writer, Deno.Closer {
  readonly #stream: NonNullable<childProcess.ChildProcess["stdin"]>;
  readonly #streamWriter: StreamWriter;

  constructor(stream: NonNullable<childProcess.ChildProcess["stdin"]>) {
    this.#stream = stream;
    this.#streamWriter = new StreamWriter(stream);
  }

  static fromNullable(stream: childProcess.ChildProcess["stdin"]) {
    return stream ? new ProcessWriteStream(stream) : undefined;
  }

  write(p: Uint8Array): Promise<number> {
    return this.#streamWriter.write(p);
  }

  close() {
    this.#stream.end();
  }
}
