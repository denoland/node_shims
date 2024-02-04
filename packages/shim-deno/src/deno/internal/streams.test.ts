import { BufferStreamReader, StreamWriter } from "./streams.js";
import fs from "node:fs";
import assert from "node:assert/strict";

// use a small buffer size for testing to cause many reads and writes
const highWaterMark = 128;

Deno.test("reader should read", async () => {
  const stream = fs.createReadStream("README.md", { highWaterMark });
  const reader = new BufferStreamReader(stream);
  const chunks: Buffer[] = [];
  while (true) {
    const buffer = Buffer.alloc(getRandomBufferSize());
    const readSize = await reader.read(buffer);
    if (readSize == null) {
      break;
    }
    chunks.push(buffer.slice(0, readSize));
  }
  stream.close();
  const result = Buffer.concat(chunks);
  const expectedBytes = fs.readFileSync("README.md");
  assert.deepEqual(expectedBytes, result);
});

Deno.test("reader should read all", async () => {
  const stream = fs.createReadStream("README.md", { highWaterMark });
  const reader = new BufferStreamReader(stream);
  const result = await reader.readAll();
  stream.close();
  const expectedBytes = fs.readFileSync("README.md");
  assert.deepEqual(expectedBytes, Buffer.from(result));
});

Deno.test("writer should write", async () => {
  const tempFile = await Deno.makeTempFile();
  try {
    const readStream = fs.createReadStream("README.md", { highWaterMark });
    const reader = new BufferStreamReader(readStream);
    const writeStream = fs.createWriteStream(tempFile, { highWaterMark });
    const writer = new StreamWriter(writeStream);
    while (true) {
      const buffer = Buffer.alloc(getRandomBufferSize());
      const readSize = await reader.read(buffer);
      if (readSize == null) {
        break;
      }
      await writer.write(buffer.slice(0, readSize));
    }
    writeStream.close();
    readStream.close();

    assert.deepEqual(
      fs.readFileSync("README.md"),
      fs.readFileSync(tempFile),
    );
  } finally {
    fs.unlinkSync(tempFile);
  }
});

function getRandomBufferSize() {
  // use a value sometimes higher than the buffer size and sometimes lower
  const highValue = highWaterMark * 2;
  const lowValue = Math.floor(highWaterMark / 2);
  return Math.floor(Math.random() * (highValue - lowValue + 1)) + lowValue;
}
