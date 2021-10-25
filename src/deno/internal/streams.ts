/// <reference path="../stable/lib.deno.d.ts" />

export class BufferStreamReader implements Deno.Reader {
  readonly #stream: NodeJS.ReadableStream;
  #pending: Buffer[] = [];
  // deno-lint-ignore no-explicit-any
  #error: any;
  #ended = false;
  #readCount = 0;

  constructor(stream: NodeJS.ReadableStream) {
    this.#stream = stream;
    this.#stream.pause();

    // now that the stream is paused, drain the internal stream buffer
    // and put the contents into the pending buffer
    while (true) {
      const buffer = this.#stream.read();
      if (!buffer) {
        break;
      }

      if (typeof buffer === "string") {
        throw new Error("Unsupported string stream in BufferStreamReader.");
      }

      this.#pending.push(buffer);
    }
  }

  readAll(): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      if (this.#ended) {
        resolve(new Uint8Array(0));
        return;
      } else if (this.#error) {
        reject(this.#error);
        return;
      }

      const chunks = this.#readPending().chunks;

      this.#withListeners({
        onData: (buffer) => {
          chunks.push(buffer);
        },
        onEnd: () => {
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
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  }

  read(p: Uint8Array): Promise<number | null> {
    return new Promise((resolve, reject) => {
      if (this.#error) {
        reject(this.#error);
        return;
      }

      let currentByteIndex = 0;
      const pending = this.#readPending(p.byteLength);
      for (const chunk of pending.chunks) {
        chunk.copy(p, currentByteIndex, 0, chunk.byteLength);
        currentByteIndex += chunk.byteLength;
      }

      // resolve right away if any pending bytes were read
      if (pending.totalByteLength > 0) {
        resolve(pending.totalByteLength);
        return;
      }

      if (this.#ended) {
        resolve(null);
        return;
      }

      this.#withListeners({
        onData: (buffer, onExit) => {
          const readLength = Math.min(
            buffer.byteLength,
            p.byteLength,
          );
          buffer.copy(p, 0, 0, readLength);

          if (readLength > 0 && readLength < buffer.byteLength) {
            this.#pending.push(buffer.slice(readLength));
          }
          if (readLength > 0) {
            resolve(readLength);
            onExit();
          }
        },
        onEnd: () => {
          resolve(null);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  }

  #withListeners(listeners: {
    onData: (buffer: Buffer, exit: () => void) => void;
    // deno-lint-ignore no-explicit-any
    onError: (err: any) => void;
    onEnd: () => void;
  }) {
    const dataListener = (buffer: Buffer) => {
      listeners.onData(buffer, onExit);
    };
    const endListener = () => {
      this.#ended = true;
      listeners.onEnd();
      onExit();
    };
    // deno-lint-ignore no-explicit-any
    const errorListener = (error: any) => {
      this.#error = error;
      listeners.onError(error);
      onExit();
    };
    const onExit = () => {
      this.#readCount--;
      if (this.#readCount === 0) {
        this.#stream.pause();
      }
      this.#stream.off("data", dataListener);
      this.#stream.off("end", endListener);
      this.#stream.off("error", errorListener);
    };
    this.#stream.on("data", dataListener);
    this.#stream.on("end", endListener);
    this.#stream.on("error", errorListener);

    if (this.#readCount === 0) {
      this.#stream.resume();
    }

    this.#readCount++;
  }

  #readPending(maxLength?: number) {
    if (maxLength == null) {
      const chunks = this.#pending.splice(0);
      return {
        chunks,
        totalByteLength: chunks
          .map((a) => a.byteLength)
          .reduce((a, b) => a + b, 0),
      };
    } else {
      let readIndex = 0;
      let bufferCount = 0;
      let endSubIndex = 0;
      for (let i = 0; i < this.#pending.length; i++) {
        const remainingBytes = maxLength - readIndex;
        if (remainingBytes < this.#pending[i].byteLength) {
          endSubIndex = remainingBytes;
          readIndex += remainingBytes;
          break;
        }

        readIndex += this.#pending[i].byteLength;
        bufferCount++;
      }
      const chunks = this.#pending.splice(0, bufferCount);
      if (endSubIndex > 0) {
        chunks.push(this.#pending[0].slice(0, endSubIndex));
        this.#pending[0] = this.#pending[0].slice(endSubIndex);
      }

      return {
        chunks,
        totalByteLength: readIndex,
      };
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
