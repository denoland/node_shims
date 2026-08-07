///<reference path="../lib.deno.d.ts" />

import { createConnection } from "net";
import { Conn } from "../../internal/Conn.js";
import {
  ConnectOptions,
  NetAddr,
  TcpConn,
  UnixConn,
  UnixConnectOptions,
} from "../types.js";

function connect(options: ConnectOptions): Promise<TcpConn>;
function connect(options: UnixConnectOptions): Promise<UnixConn>;
function connect(
  options: ConnectOptions | UnixConnectOptions,
): Promise<TcpConn | UnixConn> {
  if (options.transport === "unix") {
    throw new Error("Unstable UnixConnectOptions is not implemented");
  }
  const { transport = "tcp", hostname = "127.0.0.1", port } = options;
  if (transport !== "tcp") {
    throw new Error("Deno.connect is only implemented for transport: tcp");
  }

  const socket = createConnection({ port, host: hostname });

  socket.on("error", (err) => console.error(err));

  return new Promise<Conn<NetAddr>>((resolve) => {
    socket.once("connect", () => {
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

      resolve(new Conn(rid, localAddr, remoteAddr, socket));
    });
  });
}

const connectFunc: typeof Deno.connect = connect;
export { connectFunc as connect };
