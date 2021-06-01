///<reference path="../stable/lib.deno.d.ts" />

import { close } from "../stable/functions/close.js";
import * as errors from "../stable/variables/errors.js";

export class Listener implements Deno.Listener {
  #listener: AsyncIterableIterator<Deno.Conn>;

  constructor(
    readonly rid: number,
    readonly addr: Deno.Addr,
    listener: AsyncIterableIterator<Deno.Conn>,
  ) {
    this.#listener = listener;
  }

  async accept() {
    if (!this.#listener) {
      throw new errors.BadResource("Listener not initialised");
    }

    const result = await this.#listener.next();
    if (result.done) {
      throw new errors.BadResource("Server not listening");
    }
    return result.value;
  }

  async next() {
    let conn;
    try {
      conn = await this.accept();
    } catch (error) {
      if (error instanceof errors.BadResource) {
        return { value: undefined, done: true } as const;
      }
      throw error;
    }
    return { value: conn, done: false };
  }

  return<T>(value: T | Deno.Conn) {
    this.close();
    return Promise.resolve({ value, done: true });
  }

  close() {
    close(this.rid);
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}
