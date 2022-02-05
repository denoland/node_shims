#!/usr/bin/env -S deno run --allow-read='.'

import { Project, Symbol, SymbolFlags } from "./deps.ts";

let exitCode = 0;
const ExitCodes = {
  missingType: 1,
  typeError: 3,
} as const;

const project = new Project({
  tsConfigFilePath: `./tsconfig.json`,
});
const typeChecker = project.getTypeChecker().compilerObject;

const entryPoint = project.addSourceFileAtPath(`./src/deno.ts`);
const implemented = new Set(entryPoint.getExportedDeclarations().keys());

const stableMembers = getDenoMembersFromFile(`./src/deno/stable/lib.deno.d.ts`);
const unstableMembers = getDenoMembersFromFile(
  `./src/deno/unstable/lib.deno.unstable.d.ts`,
);

outputInfo({
  categoryName: "Stable",
  members: stableMembers,
  includeUnstableInCount: false,
});
console.log("");
outputInfo({
  categoryName: "Unstable",
  members: unstableMembers,
  includeUnstableInCount: false,
});

const diagnostics = project.getPreEmitDiagnostics();
if (diagnostics.length !== 0) {
  console.error();
  console.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
  console.error(`Found ${diagnostics.length} errors.`);
  exitCode = ExitCodes.typeError;
}

Deno.exit(exitCode);

function getDenoMembersFromFile(filePath: string) {
  return project
    .addSourceFileAtPath(filePath)
    .getModuleOrThrow("Deno")
    .getSymbolOrThrow()
    .getExports()
    .map(processExport)
    .sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name));
}

function processExport(symbol: Symbol) {
  const deprecated = symbol.getJsDocTags().some((tag) =>
    tag.getName() === "deprecated"
  );
  const unstable = symbol.compilerSymbol.getDocumentationComment(typeChecker)[0]
    ?.text.includes("UNSTABLE");
  const typeOnly = symbol.hasFlags(SymbolFlags.Interface) ||
    symbol.hasFlags(SymbolFlags.TypeAlias);
  return {
    deprecated,
    implemented: implemented.has(symbol.getName()),
    name: symbol.getName(),
    stable: !(unstable || deprecated),
    typeOnly,
    unstable,
  };
}

function outputInfo(opts: {
  categoryName: string;
  members: ReturnType<typeof processExport>[];
  includeUnstableInCount: boolean;
}) {
  const filteredMembers = opts.includeUnstableInCount
    ? opts.members
    : opts.members.filter((m) => m.stable);
  const membersImpl = filteredMembers.filter((member) => member.implemented);
  const percentage = Math.floor(
    membersImpl.length * 100 / filteredMembers.length,
  );
  const toGo = filteredMembers.length - membersImpl.length;
  console.info(`# ${opts.categoryName} Progress\n`);
  console.info(
    `${percentage}%. ${toGo} ${opts.categoryName.toLowerCase()} members to go:\n`,
  );

  const onlyToGo = Deno.isatty(Deno.stdout.rid);
  for (const member of opts.members) {
    const toGo = !(member.implemented || member.deprecated);
    if (onlyToGo && !toGo) continue;
    const ghost = member.typeOnly ? " 👻" : "";
    const flask = member.unstable ? " 🧪" : "";
    const down = member.deprecated ? " 👎" : "";
    const checkmark = member.implemented ? `[x]` : "[ ]";
    if (member.typeOnly && member.stable && !member.implemented) {
      exitCode ||= ExitCodes.missingType;
    }
    console.log(`- ${checkmark}${down}${flask}${ghost} **\`${member.name}\`**`);
  }
}
