///<reference path="../lib.deno.d.ts" />

import { connect as tlsConnect } from "tls";

import { Conn } from "../../internal/Conn";
import { readTextFile } from "./readTextFile";

export const connectTls: typeof Deno.connectTls = async function connectTls(
  { port, hostname = "127.0.0.1", certFile },
) {
  const cert = certFile && await readTextFile(certFile);

  const socket = tlsConnect({ port, host: hostname, cert });

  return new Promise((resolve) => {
    socket.on("connect", () => {
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
