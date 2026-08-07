///<reference path="../lib.deno.d.ts" />

import { createServer, Server } from "net";

import { Conn } from "../../internal/Conn.js";
import { Listener } from "../../internal/Listener.js";
import {
  TcpListener,
  TcpListenOptions,
  UnixListener,
  UnixListenOptions,
} from "../types.js";

async function* _listen(
  server: Server,
  waitFor: Promise<void>,
): AsyncIterableIterator<Deno.Conn> {
  await waitFor;

  while (server.listening) {
    yield new Promise<Deno.Conn>((resolve) =>
      server.once("connection", (socket) => {
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

        resolve(new Conn(rid, localAddr, remoteAddr));
      })
    );
  }
}

function listen(options: TcpListenOptions & { transport?: "tcp" }): TcpListener;
function listen(
  options: UnixListenOptions & { transport: "unix" },
): UnixListener;
function listen(
  options:
    | TcpListenOptions & { transport?: "tcp" }
    | UnixListenOptions & { transport: "unix" },
): TcpListener | UnixListener {
  if (options.transport === "unix") {
    throw new Error("Unstable UnixListenOptions is not implemented");
  }
  const { port, hostname = "0.0.0.0", transport = "tcp" } = options;
  if (transport !== "tcp") {
    throw new Error("Deno.listen is only implemented for transport: tcp");
  }

  const server = createServer();

  const waitFor = new Promise<void>((resolve) =>
    // server._handle.fd is assigned immediately on .listen()
    server.listen(port, hostname, resolve)
  );

  // @ts-expect-error undocumented socket._handle property
  const listener: TcpListener = new Listener(server._handle.fd, {
    hostname,
    port,
    transport: "tcp",
  }, _listen(server, waitFor));

  return listener;
}

const listenFunc: typeof Deno.listen = listen;
export { listenFunc as listen };
