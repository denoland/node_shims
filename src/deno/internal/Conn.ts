import type { Socket } from "net";

import { File } from "../stable/classes/File.js";

export class Conn extends File implements Deno.Conn {
  constructor(
    readonly rid: number,
    readonly localAddr: Deno.Addr,
    readonly remoteAddr: Deno.Addr,
    private socket: Socket,
  ) {
    super(rid);
  }
  async closeWrite() {
    await new Promise<void>((resolve) => this.socket.end(resolve));
  }
}
