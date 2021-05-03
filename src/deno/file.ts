///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import { promisify } from "util";
import { readSync } from "./readSync";
import { write } from "./write";
import { writeSync } from "./writeSync";

const nodeFtruncate = promisify(fs.ftruncate);

export class File implements Deno.File {
  constructor(readonly rid: number) {}
  async write(p: Uint8Array): Promise<number> {
    return await write(this.rid, p);
  }
  writeSync(p: Uint8Array): number {
    return writeSync(this.rid, p);
  }
  async truncate(len?: number): Promise<void> {
    await nodeFtruncate(this.rid, len);
  }
  // @ts-expect-error https://github.com/denoland/deno/pull/10353
  truncateSync(len?: number): void {
    return fs.ftruncateSync(this.rid, len);
  }
  // deno-lint-ignore no-unused-vars
  read(p: Uint8Array): Promise<number | null> {
    throw new Error("Method not implemented.");
  }
  readSync(p: Uint8Array): number | null {
    return readSync(this.rid, p);
  }
  // deno-lint-ignore no-unused-vars
  seek(offset: number, whence: Deno.SeekMode): Promise<number> {
    throw new Error("Method not implemented.");
  }
  // deno-lint-ignore no-unused-vars
  seekSync(offset: number, whence: Deno.SeekMode): number {
    throw new Error("Method not implemented.");
  }
  stat(): Promise<Deno.FileInfo> {
    throw new Error("Method not implemented.");
  }
  statSync(): Deno.FileInfo {
    throw new Error("Method not implemented.");
  }
  close(): void {
    fs.closeSync(this.rid);
  }
}
