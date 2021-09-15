#!/usr/bin/env -S deno run --allow-read='.'

import {
  Project,
  Symbol,
  SymbolFlags,
} from "https://deno.land/x/ts_morph@12.0.0/mod.ts";

let exitCode = 0;
const ExitCodes = {
  missingType: 1,
  typeError: 3,
} as const;

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
});
const typeChecker = project.getTypeChecker().compilerObject;

const entryPoint = project.addSourceFileAtPath("./src/deno.ts");
const implemented = new Set(entryPoint.getExportedDeclarations().keys());

// deno-lint-ignore ban-types
const processExport = (symbol: Symbol) => {
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
};

const documented = project
  .addSourceFileAtPath("./src/deno/stable/lib.deno.d.ts")
  .getModuleOrThrow("Deno")
  .getSymbolOrThrow()
  .getExports()
  .map(processExport)
  .sort((a, b) => Number(a.name > b.name) - Number(a.name < b.name));

const stable = documented.filter((member) => member.stable);
const stableImpl = stable.filter((member) => member.implemented);
const percentage = Math.floor(stableImpl.length * 100 / stable.length);
const toGo = stable.length - stableImpl.length;
console.info("# Progress\n");
console.info(`${percentage}%. ${toGo} stable members to go:\n`);

const onlyToGo = Deno.isatty(Deno.stdout.rid);
for (const member of documented) {
  const toGo = !(member.implemented || member.unstable || member.deprecated);
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

const diagnostics = project.getPreEmitDiagnostics();
if (diagnostics.length !== 0) {
  console.error();
  console.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
  console.error(`Found ${diagnostics.length} errors.`);
  exitCode = ExitCodes.typeError;
}

Deno.exit(exitCode);
