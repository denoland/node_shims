///<reference path="../lib.deno.d.ts" />

import { spawn } from "child_process";

import { Process } from "../classes/Process.js";

function mapToNode(std: Deno.RunOptions["stdin" | "stderr" | "stdout"]) {
  switch (std) {
    case "inherit":
      return "inherit";
    case "piped":
      return "pipe";
    case "null":
      return "ignore";
    default:
      return std;
  }
}

export const run: typeof Deno.run = function run(
  { cmd, cwd, env, stdin, stdout, stderr },
) {
  const [command, ...args] = cmd as [string | URL, ...string[]];

  if (command instanceof URL) {
    throw new Error("Cannot run Deno.run with URL imports in node.");
  }

  const child = spawn(command, args, {
    cwd,
    env,
    stdio: [stdin, stdout, stderr].map(mapToNode),
  });

  return new Process(child);
};
