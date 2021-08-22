///<reference path="../lib.deno.d.ts" />

import * as os from "os";
import { once } from "events";
import { Buffer } from "buffer";
import type { ChildProcess } from "child_process";
import type { Readable, Writable } from "stream";

type SignalName = keyof typeof os.constants.signals;

async function bufferFromReadable(readable: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function readerFromReadable(readable: Readable): Deno.Reader & Deno.Closer {
  return {
    async read(p) {
      if (readable.readableEnded) return null;
      const chunk = await readable.read(p.length);
      if (chunk === null) return 0;
      p.set(chunk);
      return chunk.length;
    },
    close() {
      readable.destroy();
    },
  };
}

function writerFromWritable(writable: Writable): Deno.Writer & Deno.Closer {
  return {
    async write(p) {
      return await new Promise<number>((resolve, reject) =>
        writable.write(p, (error) => error ? reject(error) : resolve(p.length))
      );
    },
    close() {
      writable.end();
    },
  };
}

export class Process<T extends Deno.RunOptions> implements Deno.Process<T> {
  readonly #cp: ChildProcess;
  readonly #status;
  constructor(cp: ChildProcess) {
    this.#cp = cp;
    this.#status = once(cp, "exit");
  }

  get rid() {
    return NaN;
  }

  get pid() {
    return this.#cp.pid!;
  }

  get stdin() {
    return writerFromWritable(this.#cp.stdin!);
  }

  get stdout() {
    return readerFromReadable(this.#cp.stdout!);
  }

  get stderr() {
    return readerFromReadable(this.#cp.stderr!);
  }

  async status() {
    const [code, signalName] = await this.#status as [number, SignalName];
    const signal = os.constants.signals[signalName];
    const success = code === 0;
    return { code, signal, success } as Deno.ProcessStatus;
  }

  async output() {
    return await bufferFromReadable(this.#cp.stdout!);
  }

  async stderrOutput() {
    return await bufferFromReadable(this.#cp.stderr!);
  }

  close() {}

  kill(signo: number) {
    this.#cp.kill(signo);
  }
}
