///<reference path="../stable/lib.deno.d.ts" />

import { Socket } from "net";
import { once } from "events";

import { FsFile } from "../stable/classes/FsFile.js";
import { NetAddr } from "../stable/types.js";

export class Conn<A extends Deno.Addr = Deno.Addr> extends FsFile
  implements Deno.Conn<A> {
  #socket: Socket;

  constructor(
    readonly rid: number,
    readonly localAddr: A,
    readonly remoteAddr: A,
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

  async read(p: Uint8Array): Promise<number | null> {
    try {
      return await super.read(p);
    } catch (error) {
      if (
        !(error instanceof Error && "code" in error &&
          error.code == "EAGAIN")
      ) {
        throw error;
      }
    }
    await once(this.#socket, "readable");
    return await super.read(p);
  }
}

export class TlsConn extends Conn<NetAddr> implements Deno.TlsConn {
  handshake(): Promise<Deno.TlsHandshakeInfo> {
    console.warn("@deno/shim-deno: Handshake is not supported.");
    return Promise.resolve({
      alpnProtocol: null,
    });
  }
}
