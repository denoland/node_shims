///<reference path="../lib.deno.d.ts" />

import childProcess from "child_process";
import fs from "fs";
import os from "os";
import url from "url";
import { once } from "events";
import which from "which";

import { BufferStreamReader } from "../../internal/streams.js";
import * as errors from "../variables/errors.js";

type SignalName = keyof typeof os.constants.signals;

function getCmd(firstArg: string | URL) {
  if (firstArg instanceof URL) {
    return url.fileURLToPath(firstArg);
  } else {
    return firstArg;
  }
}

function getEnv(options: Deno.CommandOptions) {
  const env = options.env ?? {};
  for (const name in process.env) {
    if (!Object.prototype.hasOwnProperty.call(env, name)) {
      if (options.clearEnv) {
        if (os.platform() === "win32") {
          env[name] = "";
        } else {
          delete env[name];
        }
      } else {
        env[name] = process.env[name]!;
      }
    }
  }
  return env;
}

function getStdio(
  value: Deno.CommandOptions["stdout"] | undefined,
): childProcess.StdioPipe | childProcess.StdioNull {
  if (value === "inherit" || value == null) {
    return "inherit" as const; // default
  } else if (value === "piped") {
    return "pipe" as const;
  } else if (value === "null") {
    return "ignore" as const;
  } else {
    throw new Error("Unknown value.");
  }
}

function parseCommandStatus(
  statusCode: number | null,
  signalName: NodeJS.Signals | null,
): Deno.CommandStatus {
  if (!statusCode && !signalName) {
    return { success: false, code: 1, signal: null };
  }

  // when there is a signal, the exit code is 128 + signal code
  const signal = signalName
    ? os.constants.signals[signalName]
    : statusCode != null && statusCode > 128
    ? statusCode - 128
    : undefined;

  // default to 1 if code can not be determined
  const code = statusCode != null
    ? statusCode
    : signal != null
    ? 128 + signal
    : 1;
  const success = code === 0;

  return { success, code, signal: signalName as Deno.Signal | null };
}

export class Command implements Deno.Command {
  constructor(
    readonly command: string | URL,
    readonly options: Deno.CommandOptions = {},
  ) {}

  async output(): Promise<Deno.CommandOutput> {
    if (this.options.cwd && !fs.existsSync(this.options.cwd)) {
      throw new errors.NotFound("No such file or directory.");
    }

    // childProcess.spawn will asynchronously check if the command exists, but
    // we need to do this synchronously
    const commandName = getCmd(this.command);
    if (!which.sync(commandName, { nothrow: true })) {
      throw new errors.NotFound("No such file or directory");
    }

    const cp = childProcess.spawn(commandName, this.options.args || [], {
      cwd: this.options.cwd,
      env: getEnv(this.options),
      uid: this.options.uid,
      gid: this.options.gid,
      shell: false,
      windowsVerbatimArguments: this.options.windowsRawArguments,
      signal: this.options.signal,
      stdio: [
        getStdio(this.options.stdin),
        getStdio(this.options.stdout),
        getStdio(this.options.stderr),
      ],
    });

    const status = await once(cp, "exit");

    const stdout = cp.stdout
      ? await new BufferStreamReader(cp.stdout).readAll()
      : new Uint8Array();
    const stderr = cp.stderr
      ? await new BufferStreamReader(cp.stderr).readAll()
      : new Uint8Array();

    const [statusCode, signalName] = status as [
      number,
      SignalName | null,
    ];

    const commandStatus = parseCommandStatus(statusCode, signalName);

    const out: Deno.CommandOutput = {
      stdout: stdout,
      stderr: stderr,
      ...commandStatus,
    };

    return out;
  }

  outputSync(): Deno.CommandOutput {
    if (this.options.cwd && !fs.existsSync(this.options.cwd)) {
      throw new errors.NotFound("No such file or directory.");
    }

    // childProcess.spawn will asynchronously check if the command exists, but
    // we need to do this synchronously
    const commandName = getCmd(this.command);
    if (!which.sync(commandName, { nothrow: true })) {
      throw new errors.NotFound("No such file or directory");
    }

    const cp = childProcess.spawnSync(
      commandName,
      {
        cwd: this.options.cwd,
        env: getEnv(this.options),
        uid: this.options.uid,
        gid: this.options.gid,
        windowsVerbatimArguments: this.options.windowsRawArguments,
        signal: this.options.signal,
        stdio: [
          getStdio(this.options.stdin),
          getStdio(this.options.stdout),
          getStdio(this.options.stderr),
        ],
      },
    );

    const stdout = new Uint8Array(cp.stdout);
    const stderr = new Uint8Array(cp.stderr);

    const commandStatus = parseCommandStatus(
      cp.status,
      cp.signal,
    );

    const out: Deno.CommandOutput = {
      stdout: stdout,
      stderr: stderr,
      ...commandStatus,
    };

    return out;
  }

  spawn(): Deno.ChildProcess {
    throw new Error("Not implemented");
  }
}
