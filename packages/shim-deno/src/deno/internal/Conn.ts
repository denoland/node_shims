///<reference path="../stable/lib.deno.d.ts" />

import { Socket } from "net";

import { FsFile } from "../stable/classes/FsFile.js";

export class Conn extends FsFile implements Deno.Conn {
  #socket: Socket;

  constructor(
    readonly rid: number,
    readonly localAddr: Deno.Addr,
    readonly remoteAddr: Deno.Addr,
    socket?: Socket,
  ) {
    super(rid);
    this.#socket = socket || new Socket({ fd: rid });
  }

  [Symbol.dispose]() {
    this.close();
  }

  async closeWrite() {
    await new Promise<void>((resolve) => this.#socket.end(resolve));
  }

  setNoDelay(enable?: boolean) {
    this.#socket.setNoDelay(enable);
  }

  setKeepAlive(enable?: boolean) {
    this.#socket.setKeepAlive(enable);
  }

  ref(): void {
    this.#socket.ref();
  }

  unref(): void {
    this.#socket.unref();
  }
}

export class TlsConn extends Conn implements Deno.TlsConn {
  handshake(): Promise<Deno.TlsHandshakeInfo> {
    console.warn("@deno/shim-deno: Handshake is not supported.");
    return Promise.resolve({
      alpnProtocol: null,
    });
  }
}
