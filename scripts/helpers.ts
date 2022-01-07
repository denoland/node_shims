// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.

import { Diagnostic, Project } from "./ts_morph.ts";

export function exitIfDiagnostics(project: Project, diagnostics: Diagnostic[]) {
  if (diagnostics.length > 0) {
    console.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
    console.error(`Had ${diagnostics.length} diagnostic(s).`);
    Deno.exit(1);
  }
}
