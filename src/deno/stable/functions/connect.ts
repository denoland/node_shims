///<reference path="../lib.deno.d.ts" />

import { createConnection } from "net";

import { Conn } from "../../internal/Conn";

export const connect: typeof Deno.connect = function connect(
  { port, hostname = "127.0.0.1", transport = "tcp" },
) {
  if (transport !== "tcp") {
    throw new Error("Deno.connect is only implemented for transport: tcp");
  }

  const socket = createConnection({ port, host: hostname });

  socket.on("error", (err) => console.error(err));

  return new Promise((resolve) => {
    socket.once("connect", () => {
      // @ts-expect-error undocumented socket._handle property
      const rid: number = socket._handle.fd;

      const localAddr: Deno.Addr = {
        hostname: socket.localAddress,
        port: socket.localPort,
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
};
