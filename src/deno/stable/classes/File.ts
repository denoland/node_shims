///<reference path="../lib.deno.d.ts" />

import * as fs from "fs";
import { promisify } from "util";
import { fstat } from "../functions/fstat.js";
import { fstatSync } from "../functions/fstatSync.js";
import { read } from "../functions/read.js";
import { readSync } from "../functions/readSync.js";
import { write } from "../functions/write.js";
import { writeSync } from "../functions/writeSync.js";

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
    //TODO(mkr): replace with Deno.ftruncate
    await nodeFtruncate(this.rid, len);
  }

  truncateSync(len?: number): void {
    //TODO(mkr): replace with Deno.ftruncateSync
    return fs.ftruncateSync(this.rid, len);
  }

  read(p: Uint8Array): Promise<number | null> {
    return read(this.rid, p);
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

  async stat(): Promise<Deno.FileInfo> {
    return await fstat(this.rid);
  }

  statSync(): Deno.FileInfo {
    return fstatSync(this.rid);
  }

  close(): void {
    fs.closeSync(this.rid);
  }
}
