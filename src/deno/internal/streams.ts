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
          const size = chunks
            .map((c) => c.byteLength)
            .reduce((a, b) => a + b, 0);
          const result = new Uint8Array(size);
          let offset = 0;
          for (const chunk of chunks) {
            chunk.copy(result, offset, 0, result.byteLength);
            offset += chunk.byteLength;
          }
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
      const readPending = () => {
        const pending = this.#stream.read(p.byteLength) as Buffer;
        if (!pending) {
          return false;
        }

        pending.copy(p, 0, 0, pending.byteLength);

        // resolve right away if any pending bytes were read
        if (pending.byteLength > 0) {
          resolve(pending.byteLength);
          return true;
        } else {
          return false;
        }
      };

      const action = () => {
        if (this.#error) {
          reject(this.#error);
        } else if (readPending()) {
          return;
        } else if (this.#ended) {
          resolve(null);
        } else {
          this.#pendingActions.push(action);
        }
      };

      action();
    });
  }

  #runPendingActions() {
    for (const action of this.#pendingActions.splice(0)) {
      action();
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
