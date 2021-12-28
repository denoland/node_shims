import { open } from './open.ts'
import assert from "assert/strict";
import path from 'path';


const tempDir = await Deno.makeTempDir();

Deno.test('creates file when createNew is set to true and file does not exist', async () => {

    const filePath = path.join(tempDir, 'some')

    const fileHandle = await open(filePath, { createNew: true, write: true });
    fileHandle.close();

    assert.ok(await Deno.stat(filePath));
});

Deno.test('errors when createNew is set to true and file exists', async () => {

    const testFile = await Deno.makeTempFile({ dir: tempDir });

    await assert.rejects(async () => {
        await open(testFile, { createNew: true, write: true });
    }, { message: `EEXIST: file already exists, open '${testFile}'` });
});

Deno.remove(tempDir, { recursive: true });