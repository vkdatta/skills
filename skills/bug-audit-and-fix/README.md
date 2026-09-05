# Bug Audit and Fix

An **AI-agnostic, language-agnostic software engineering skill** for auditing,
deeply tracing, surgically fixing, refactoring, revamping, and independently
validating bugs in **any codebase**.

It applies to:

- Python
- JavaScript / TypeScript
- Java / Kotlin
- C / C++
- C#
- Go
- Rust
- Swift / Objective-C
- PHP / Ruby
- SQL / database systems
- shell scripts
- CLI tools
- desktop applications
- mobile applications
- backend services
- APIs
- libraries / SDKs
- plugins
- games
- embedded systems
- web applications
- Canvas/rendering systems
- monorepos and mixed-language systems

The skill does **not** assume that every project has a UI, browser, Canvas,
database, network, or any particular language.

## Core architecture

### Junior Auditor / Fixer

Investigates every reported issue, reproduces it, traces the root cause
backward and forward, identifies chain/cross-dependency bugs, performs the
smallest safe fix, removes obsolete code, and verifies the result.

### Senior Independent Auditor

Starts again from the **original user report**, independently investigates the
patched code, checks regressions and collateral effects, and PASSes or FAILs
the result.

A Senior PASS is required before a completed patched artifact is handed over
unless the user explicitly requests an intermediate/debug artifact.

## Evidence-first engineering

The skill strongly prefers actual machine-verifiable evidence over manual
guesswork.

Depending on the project, an AI should use the strongest available tools:
compilers, interpreters, type checkers, linters, static analyzers, AST tools,
test runners, profilers, debuggers, browser automation, accessibility tools,
dependency analyzers, security scanners, package-manager diagnostics, Git
tools, database tools, build systems, benchmarks, fuzzers, generated fixtures,
and other appropriate tooling.

Tools are examples, not mandatory dependencies.

If a capability is unavailable, the AI must not fabricate its use. It should
look for an accessible equivalent, gracefully fall back, and document material
limitations.

## Surgical editing

Do not rewrite entire source files in chat merely because a few lines need
changing.

Prefer patches, CLI commands, scripts, AST codemods, targeted replacements,
and project-native migration tools. Larger refactors and subsystem revamps are
allowed when evidence shows they are safer than continuing with local patches.

## Specialized paths

Specialized skills are conditional:

- Web UI/UX Audit → only for UI/UX-related projects/issues
- Canvas → only when Canvas/rendering is present
- Mobile → only for mobile projects/issues
- Database → only when database/data-schema behavior is relevant
- Security → only when security is relevant
- Language-specific analyzers → when the language/toolchain supports them
- Other installed skills → whenever they materially own part of the problem

The core methodology remains universal.
