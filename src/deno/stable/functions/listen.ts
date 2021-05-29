///<reference path="../lib.deno.d.ts" />

import { createServer } from "net";
import * as errors from "../variables/errors.js";

const _listen = async function* _listen(
  options: Parameters<typeof Deno.listen>[0],
): AsyncIterableIterator<Deno.Conn> {
  const server = createServer();
  await new Promise<void>((resolve) =>
    server.listen(options.port, options.hostname, resolve)
  );
  while (server.listening) {
    yield new Promise<Deno.Conn>((resolve) =>
      server.once("connection", (s) => {
        s.on("error", (err) => console.error(err));
        const conn: Deno.Conn = {
          close() {
            s.destroy();
          },
          closeWrite() {
            return new Promise<void>((resolve) => s.end(resolve));
          },
          read(p) {
            return new Promise<number | null>((resolve) =>
              s.once("readable", () => {
                const data: Buffer | null = s.read(1);
                if (data == null) {
                  if (s.readableEnded) {
                    return resolve(null);
                  }
                  return resolve(0);
                }
                data.copy(p);
                return resolve(1);
              })
            );
          },
          write(p) {
            return new Promise<number>((resolve, reject) =>
              s.write(p, (err) => err ? reject(err) : resolve(p.byteLength))
            );
          },
          localAddr: {
            hostname: s.localAddress,
            transport: "tcp",
            port: s.localPort,
          },
          remoteAddr: {
            hostname: s.remoteAddress ?? "",
            transport: "tcp",
            port: s.remotePort ?? 0,
          },
          rid: 0,
        };
        resolve(conn);
      })
    );
  }
};

export const listen: typeof Deno.listen = function listen(options) {
  const listener = _listen(options);
  return Object.assign(listener, {
    async accept() {
      const result = await listener.next();
      if (result.done) {
        throw new errors.Http("Server not listening");
      }
      return result.value as Deno.Conn;
    },
    close: () => {},
    addr: {
      port: options.port,
      hostname: options.hostname ?? "0.0.0.0",
      transport: "tcp" as const,
    },
    rid: 0,
    [Symbol.asyncIterator]() {
      return listener;
    },
  });
};
