/// <reference path="../stable/lib.deno.d.ts" />

export class BufferStreamReader implements Deno.Reader {
  readonly #stream: NodeJS.ReadableStream;
  // deno-lint-ignore no-explicit-any
  #error: any;
  #ended = false;
  #pendingActions: (() => void)[] = [];

  constructor(stream: NodeJS.ReadableStream) {
    this.#stream = stream;
    this.#stream.pause();

    this.#stream.on("error", (error) => {
      this.#error = error;
      this.#runPendingActions();
    });

    this.#stream.on("readable", () => {
      this.#runPendingActions();
    });

    this.#stream.on("end", () => {
      this.#ended = true;
      this.#runPendingActions();
    });
  }

  readAll(): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const action = () => {
        if (this.#error) {
          reject(this.#error);
          return;
        }

        const buffer = this.#stream.read() as Buffer;
        if (buffer != null) {
          chunks.push(buffer);
          this.#pendingActions.push(action);
        } else if (this.#ended) {
          const result = Buffer.concat(chunks);
          resolve(result);
        } else {
          this.#pendingActions.push(action);
        }
      };

      action();
    });
  }

  read(p: Uint8Array): Promise<number | null> {
    return new Promise((resolve, reject) => {
      const action = () => {
        if (this.#error) {
          reject(this.#error);
          return;
        }

        const readBuffer = this.#stream.read(p.byteLength) as Buffer;
        if (readBuffer && readBuffer.byteLength > 0) {
          readBuffer.copy(p, 0, 0, readBuffer.byteLength);
          resolve(readBuffer.byteLength);
          return;
        }

        if (this.#ended) {
          resolve(null);
        } else {
          this.#pendingActions.push(action);
        }
      };

      action();
    });
  }

  #runPendingActions() {
    // deno-lint-ignore no-explicit-any
    const errors: any[] = [];
    for (const action of this.#pendingActions.splice(0)) {
      try {
        action();
      } catch (err) {
        errors.push(err);
      }
    }
    if (errors.length > 0) {
      throw (errors.length > 1 ? new AggregateError(errors) : errors[0]);
    }
  }
}

export class StreamWriter implements Deno.Writer {
  #stream: NodeJS.WritableStream;

  constructor(stream: NodeJS.WritableStream) {
    this.#stream = stream;
  }

  write(p: Uint8Array): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.#stream.write(p, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(p.byteLength);
        }
      });
    });
  }
}
