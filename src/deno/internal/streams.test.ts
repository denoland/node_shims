import { BufferStreamReader, StreamWriter } from "./streams.js";
import fs from "fs";

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
  assertEqualBytes(expectedBytes, result);
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

    assertEqualBytes(
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

function assertEqualBytes(expected: Buffer, actual: Buffer) {
  if (expected.byteLength !== actual.byteLength) {
    throw new Error(
      `Not equal byte lengths ${expected.byteLength} | ${actual.byteLength}`,
    );
  }
  for (let i = 0; i < expected.byteLength; i++) {
    if (expected[i] !== actual[i]) {
      throw new Error(`Bytes differed at index ${i}`);
    }
  }
}
