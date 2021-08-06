#!/usr/bin/env -S deno run --allow-run

const properties = Object.keys(Deno).sort();

const toWrite = Deno.args.find((arg) => arg.startsWith("--write"))?.split("=")
  ?.[1];

const implemented = new Set<string>(JSON.parse(new TextDecoder().decode(
  await Deno.run({
    cmd: [
      "node",
      "-r",
      "./dist/global",
      "-p",
      "JSON.stringify(Object.keys(Deno))",
    ],
    stdout: "piped",
  }).output(),
)));

const deprecated: Set<string> = new Set(
  JSON.parse(new TextDecoder().decode(
    await Deno.run({
      cmd: ["deno", "doc", "--json"],
      stdout: "piped",
    }).output(),
  ))
    .find((x: { name: string }) => x.name === "Deno").namespaceDef.elements
    .filter((x: { jsDoc?: string }) => x.jsDoc?.includes("@deprecated"))
    .map((x: { name: string }) => x.name),
);

const internals = new Set(["core", "internal"]);

const wontFix = new Set([...deprecated, ...internals]);

for (const x of wontFix) {
  if (implemented.has(x)) {
    wontFix.delete(x);
  }
}

const removed = [...implemented].filter((x) => !properties.includes(x));

const togo = properties.filter((x) => !implemented.has(x) && !wontFix.has(x));

const status = `
- total                          : ${properties.length}
- implemented                    : ${implemented.size}
- implemented, removed from Deno : ${removed.length} (${removed})
- wontfix                        : ${wontFix.size}

${togo.length} to go. (${togo})
`.trim();

console.log(status);

if (Deno.args.includes("--missing")) {
  console.log("\nMissing properties:\n");
  for (const property of properties) {
    if (!implemented.has(property) && !internals.has(property)) {
      console.log(property);
    }
  }
}

if (toWrite) {
  const totalCount = properties.length - wontFix.size;
  const normalFactor = 40 / totalCount;
  const done = Math.floor(implemented.size * normalFactor);
  const todo = Math.ceil((totalCount - implemented.size) * normalFactor);

  const progress = `${"█".repeat(done)}${"░".repeat(todo)}`;

  const all = properties
    .filter((property) => !wontFix.has(property))
    .map((property) =>
      `- [${implemented.has(property) ? "x" : " "}] **\`${property}\`**`
    )
    .join("\n");

  const wontFixList = [...wontFix].map((property) =>
    `- **\`${property}\`** (${
      deprecated.has(property)
        ? "deprecated"
        : internals.has(property)
        ? "internals"
        : "unknown"
    })`
  )
    .join("\n");

  const writePerms = await Deno.permissions.request({
    name: "write",
    path: toWrite,
  });

  if (writePerms.state === "granted") {
    Deno.writeTextFile(
      toWrite,
      [
        "# Progress",
        progress,
        status,
        "## status",
        all,
        "## wontfix",
        "(But feel free to PR)",
        wontFixList,
      ]
        .join("\n\n"),
    );
  } else {
    console.error(
      `Requires write access to "${toWrite}", run again with the --allow-write flag`,
    );
  }
}
