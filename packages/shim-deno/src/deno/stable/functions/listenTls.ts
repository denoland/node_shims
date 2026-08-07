///<reference path="../lib.deno.d.ts" />

import { createServer, Server } from "tls";

import { TlsConn } from "../../internal/Conn.js";
import { Listener } from "../../internal/Listener.js";
import { readTextFileSync } from "./readTextFileSync.js";
import { TlsCertifiedKeyFromFile } from "../types.js";

async function* _listen(
  server: Server,
  waitFor: Promise<void>,
): AsyncIterableIterator<Deno.TlsConn> {
  await waitFor;

  while (server.listening) {
    yield new Promise<Deno.TlsConn>((resolve) =>
      server.once("secureConnection", (socket) => {
        socket.on("error", (err) => console.error(err));

        // @ts-expect-error undocumented socket._handle property
        const rid: number = socket._handle.fd;

        const localAddr: Deno.Addr = {
          // cannot be undefined while socket is connected
          hostname: socket.localAddress!,
          port: socket.localPort!,
          transport: "tcp",
        };

        const remoteAddr: Deno.Addr = {
          // cannot be undefined while socket is connected
          hostname: socket.remoteAddress!,
          port: socket.remotePort!,
          transport: "tcp",
        };

        resolve(new TlsConn(rid, localAddr, remoteAddr));
      })
    );
  }
}

export const listenTls: typeof Deno.listenTls = function listenTls({
  port,
  hostname = "0.0.0.0",
  transport = "tcp",
  ...options
}) {
  if (transport !== "tcp") {
    throw new Error("Deno.listen is only implemented for transport: tcp");
  }

  const [cert, key] = [
    (options as TlsCertifiedKeyFromFile).certFile,
    (options as TlsCertifiedKeyFromFile).keyFile,
  ].map((f) => f == null ? undefined : readTextFileSync(f));

  const server = createServer({ cert, key });

  const waitFor = new Promise<void>((resolve) =>
    // server._handle.fd is assigned immediately on .listen()
    server.listen(port, hostname, resolve)
  );

  // @ts-expect-error undocumented socket._handle property
  const listener = new Listener(server._handle.fd, {
    hostname,
    port,
    transport: "tcp",
  }, _listen(server, waitFor));

  return listener;
};
