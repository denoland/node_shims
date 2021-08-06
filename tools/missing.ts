#!/usr/bin/env -S deno run --unstable --allow-read='.'

import { Project, Symbol } from "https://deno.land/x/ts_morph@11.0.0/mod.ts";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
  skipAddingFilesFromTsConfig: true,
  compilerOptions: { types: [] },
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
  return {
    deprecated,
    implemented: implemented.has(symbol.getName()),
    name: symbol.getName(),
    stable: !(unstable || deprecated),
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
  const flask = member.unstable ? " 🧪" : "";
  const down = member.deprecated ? " 👎" : "";
  const checkmark = member.implemented ? `[x]` : "[ ]";
  console.log(`- ${checkmark}${down}${flask} **\`${member.name}\`**`);
}
