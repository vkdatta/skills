---
name: canvas
description: Maintain a compact architecture mindmap as the authoritative navigation schema for software projects. Automatically create it when absent, use it to select the minimum relevant dependency closure for fixes and patches, and synchronize it after architecture-sensitive changes.
---

# CANVAS

**C.A.N.V.A.S. = Contextual Adaptive Neural Visual Architecture Schema**

## Purpose

CANVAS is a cross-model, tool-agnostic architecture-navigation skill. It gives an AI a compact current-state mindmap of a software project so the AI can locate the smallest relevant set of files before changing code.

The architecture map is a **navigation schema**, not a replacement for source code, compiler output, tests, or runtime evidence.

## Cross-Model Compatibility

These rules are intentionally written so they can be used as a plain Markdown instruction/skill by:

- ChatGPT
- Kimi
- Grok
- DeepSeek
- Gemini
- Claude

Do not depend on proprietary tool names, APIs, agent frameworks, XML formats, or vendor-specific syntax. If a host supports native skills, load this file as a skill. If it does not, treat this file as the task-level instruction set and apply the same rules manually.

### Host-neutral capability mapping

Map the required operation to whatever equivalent the host provides:

- inspect/search files -> file browser, workspace search, grep/ripgrep, shell, IDE search, or model file tool
- read file -> file viewer/editor/tool
- edit file -> patch/editor/tool
- build/test -> project-native compiler, test runner, CI command, or available execution tool
- inspect runtime -> logs, traces, console, observability tooling

If a capability is unavailable, do not pretend it was performed. Continue with the strongest available evidence and state the limitation when it affects confidence.

## Activation

Activate automatically for:

- bug fixes
- patches
- debugging and tracing
- refactors
- feature work
- API changes
- module/import/export changes
- dependency changes
- workflow/control-flow changes
- persistence/data-model changes
- build or deployment changes

Do **not** activate for operations that are purely filesystem/package handling and do not alter project architecture:

- copy
- duplicate
- zip/unzip
- upload/download
- move
- rename
- delete
- list
- other filesystem-only operations

If a filesystem operation also changes module paths, imports, exports, configuration, deployment, or another architectural boundary, activate CANVAS.

## One-Time Loading Rule

Once CANVAS is activated for a task, load its rules once and keep them active for the remainder of that task.

Do not reread CANVAS before every file operation.

Reload only when:

1. the CANVAS version changes;
2. the user explicitly asks to review CANVAS rules; or
3. an uncovered ambiguity requires checking the authoritative rules.

## Architecture File Discovery

Before broad source inspection, search for an existing architecture map.

Preferred names, in order:

1. `canvas_xd.md`
2. `architecture.md`
3. `ARCHITECTURE_MINDMAP.md`
4. `PROJECT_canvas_xd.md`
5. `PROJECT_MINDMAP.md`
6. `ARCHITECTURE_MAP.md`
7. `.architecture.md`

Prefer exactly one authoritative architecture file. Do not create competing maps when one already exists.

If none exists, create `canvas_xd.md` before beginning a non-trivial code fix, patch, debugging pass, refactor, or feature task.

## Required Format

The architecture file must be a compact hierarchical Markdown mindmap.

It must be:

- mindmap-only;
- compact but sufficiently detailed for code navigation;
- machine-readable and easy for another AI to skim;
- organized around architecture rather than prose explanation;
- free of long narrative paragraphs;
- explicit about module ownership and boundaries.

Use stable top-level sections such as:

- `PROJECT`
- `ENTRYPOINTS`
- `MODULES`
- `DEPENDENCIES`
- `DATA_FLOW`
- `CONTROL_FLOW`
- `STATE`
- `PERSISTENCE`
- `EXTERNAL_SERVICES`
- `API`
- `WORKFLOWS`
- `ERROR_PATHS`
- `INVARIANTS`
- `CONFIG`
- `BUILD`
- `DEPLOYMENT`

Add or omit branches as needed, but preserve the mindmap style.

## Navigation Authority

Treat the architecture map as the primary **navigation** authority and source code as the **behavior** authority.

Precedence:

- **Navigation:** architecture map
- **Actual behavior:** source code
- **Build truth:** actual compiler/build/test output
- **Runtime truth:** observed logs/traces/runtime behavior

The map must never override stronger evidence. If the map is stale in the area being modified, repair it during the task.

## Before Reading Code

For a bug fix or patch:

1. Locate the architecture map.
2. Skim it first.
3. Identify the relevant entrypoint, API, module, workflow, or subsystem.
4. Follow only the dependency and control/data paths needed for the issue.
5. Read the minimum dependency closure necessary to diagnose the bug.
6. Expand scope only when evidence requires it.

Do not reread the entire project merely because the project is available.

## Patch Navigation Formula

Derive the smallest relevant path before editing:

`issue -> entrypoint -> owning module -> direct dependencies -> state/persistence -> downstream effects`

For cross-module bugs, inspect the complete affected path but avoid unrelated modules.

For build/import/export errors, inspect:

- reported file;
- imports and exports;
- defining module for imported symbols;
- re-export boundaries;
- package/build configuration only when implicated.

For runtime/workflow errors, inspect:

- request/entrypoint;
- workflow/control-flow owner;
- persistence/state markers;
- dependent workflow/module;
- error handling and retry/polling path.

## Architecture Coverage

The map should be detailed enough for an AI to locate likely edit points without opening unrelated files.

For each important module, record:

- file path/name;
- responsibility;
- exports/entrypoints it defines;
- important imports/dependencies;
- data it reads/writes;
- workflows it participates in;
- externally visible APIs, if any;
- important state/persistence interactions;
- error boundaries or critical failure paths;
- architectural invariants it owns or enforces.

Make relationships directional where useful:

`A -> B`

`A DEFINES X`

`A REEXPORTS X FROM B`

`A READS -> R2:key-pattern`

`A WRITES -> DB/table/key-pattern`

Avoid ambiguous ownership statements.

## Definitions vs Re-Exports

Always distinguish definitions from re-exports.

Example:

- `commit-workflows.js`
  - `DEFINES -> CommitWorkflow`
  - `DEFINES -> CommitFanOutWorkflow`
  - `DEFINES -> CommitBatchWorkflow`

- `worker.js`
  - `REEXPORTS -> CommitWorkflow FROM commit-workflows.js`
  - `REEXPORTS -> CommitFanOutWorkflow FROM commit-workflows.js`
  - `REEXPORTS -> CommitBatchWorkflow FROM commit-workflows.js`

Never represent a re-export as a second definition.

## Architecture as a Patch Index

A future AI should be able to answer these questions from CANVAS before opening broad source files:

- Where does this request enter?
- Which file owns the behavior?
- Which files directly feed that behavior?
- Which state or persistence records are involved?
- Which downstream modules/workflows are affected?
- Where can this failure propagate?
- Which invariant could be violated?
- Which files are safe to ignore for this issue?

If the map cannot answer these for an important subsystem, enrich that subsystem's map branch rather than documenting every line of code.

## New Projects

If no architecture file exists:

1. identify entrypoints;
2. identify source modules/files;
3. identify major dependencies/imports;
4. identify APIs/workflows;
5. identify data flow, persistence, and state;
6. identify external services;
7. identify critical error paths and invariants;
8. identify build/deployment boundaries;
9. create `canvas_xd.md` in the required mindmap format;
10. use that map for the remainder of the task.

Do not attempt to document every line of code.

## Existing Projects

If an architecture file exists:

1. read it first;
2. use it to locate likely files;
3. validate only relevant claims against source/build/runtime evidence;
4. patch the relevant files;
5. synchronize the map if architecture changed.

If the relevant map branch is clearly stale, repair it before relying on it.

## Structural Validation

When modifying module structure, verify:

- no duplicate definitions;
- no duplicate exports;
- no duplicate import bindings;
- no missing local imports;
- no accidental shadowing across architectural boundaries;
- definitions and re-exports remain distinct;
- architecture nodes correspond to real files/symbols;
- dependency arrows reflect actual imports/calls/data flow.

When a compiler/build/test tool is available, use actual output as build truth rather than assuming correctness.

## Architecture Synchronization

Update the architecture map in the same task if any of these change:

- file/module set;
- module responsibility;
- imports or exports;
- dependency relationships;
- API routes or contracts;
- workflow/control flow;
- state transitions;
- persistence keys/tables/buckets;
- external service interactions;
- configuration affecting architecture;
- build/deployment structure;
- critical error paths;
- architectural invariants.

Do **not** rewrite the architecture for changes that are purely:

- comments;
- formatting;
- spelling;
- internal implementation details with no architectural impact.

When uncertain, prefer a small precise architecture update over allowing the map to become stale.

## Updating Rules

Update the map in the same task as the structural code change.

Keep it:

- compact;
- deduplicated;
- internally consistent;
- directly tied to current source structure;
- easy to skim before the next patch.

The architecture file is a current-state map, not a changelog or prose diary.

## Completion Check

Before finishing an architecture-sensitive task, confirm:

- architecture file exists;
- it is the single preferred architecture map;
- changed architecture is represented;
- module ownership is unambiguous;
- imports/exports are accurate;
- workflow/data/state paths are current;
- no duplicate architecture nodes were introduced;
- source/build/runtime evidence is not contradicted by the map.
