///<reference path="../stable/lib.deno.d.ts" />

import { Socket } from "net";

import { File } from "../stable/classes/File.js";

export class Conn extends File implements Deno.Conn {
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

  async closeWrite() {
    await new Promise<void>((resolve) => this.#socket.end(resolve));
  }
}

export class TlsConn extends Conn implements Deno.TlsConn {
  handshake() {
    console.warn("deno.ns: Handshake is not supported.");
    return Promise.resolve();
  }
}
