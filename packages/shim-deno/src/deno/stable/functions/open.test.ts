import { open } from "./open.ts"
import assert from "assert/strict";
import path from "path";

const withTempDir = (test: (tempDirPath: string) => Promise<void>) => async () => {
    const tempDirPath = await Deno.makeTempDir();
    try {
        await test(tempDirPath);
    } finally {
        await Deno.remove(tempDirPath, { recursive: true });
    }
}

Deno.test("creates file when createNew is set to true and file does not exist",
    withTempDir(async (tempDirPath) => {
        const filePath = path.join(tempDirPath, "some")

        const fileHandle = await open(filePath, { createNew: true, write: true });
        fileHandle.close();

        assert.ok(await Deno.stat(filePath));
    }));

Deno.test("errors when createNew is set to true and file exists", withTempDir(async (tempDirPath) => {

    const testFile = await Deno.makeTempFile({ dir: tempDirPath });

    await assert.rejects(
        open(testFile, { createNew: true, write: true }),
        { message: `EEXIST: file already exists, open '${testFile}'` }
    );
}));
