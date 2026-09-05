# SKILL.md — Bug Audit and Fix

## 0. Mission

Find, deeply trace, fix, refactor, revamp, and independently validate software
bugs.

This is an **AI-agnostic and language-agnostic** engineering skill.

It applies to any software project, including applications, services,
libraries, SDKs, plugins, scripts, command-line programs, mobile apps, desktop
apps, games, embedded software, databases, APIs, web applications, rendering
systems, and mixed-language repositories.

Never assume the project has a UI, browser, Canvas, database, network, or a
particular programming language.

This is NOT an audit-only skill.

The desired outcome is a correct, verified patch when source/runtime access is
available. The workflow may diagnose, reproduce, trace, fix, refactor, revamp,
remove dead code, add tests, benchmark, and verify.

Default to surgical changes. A larger refactor or complete subsystem revamp is
allowed when evidence shows local changes cannot safely remove the root defect
or would create greater risk.

---

# 1. Mandatory two-auditor model

## Auditor 1 — Junior Auditor / Fixer

1. Read every issue supplied by the user before modifying anything.
2. Preserve the intent and wording of every issue.
3. Reproduce each issue where possible.
4. Investigate each issue independently before grouping symptoms.
5. Trace backward to the root cause.
6. Trace forward to meaningful consequences.
7. Identify chain bugs and shared root causes.
8. Inspect source, state, control flow, data flow, I/O, persistence,
   concurrency, lifecycle, dependencies, and runtime behavior as relevant.
9. Use the strongest available machine-verifiable tools.
10. Plan the smallest safe fix.
11. Implement it.
12. Remove dead code made obsolete by the fix.
13. Run targeted tests and regression checks.
14. Prepare evidence for Auditor 2.

A symptom disappearing is not proof that its root cause is fixed.

## Auditor 2 — Senior Independent Auditor

The Senior Auditor MUST start from scratch.

Do not merely review the Junior Auditor's conclusions.

The Senior Auditor must:

1. Re-read the original user issues.
2. Inspect the patched code independently.
3. Independently reproduce original bugs where possible.
4. Independently trace their original paths.
5. Search all consumers of changed code.
6. Search for regressions and collateral effects.
7. Check relevant architecture, lifecycle, concurrency, I/O, persistence,
   performance, security, UI, and platform behavior.
8. Independently use available diagnostic/testing tools.
9. Check dead code, duplication, module size, and architectural side effects.
10. Verify tests and runtime evidence.
11. PASS only when evidence supports the result.
12. FAIL when any meaningful original defect, chain bug, regression, or material
    quality problem remains.

If FAIL, return exact findings to Auditor 1, repair, and repeat the Senior audit
from scratch.

The Senior Auditor is a genuine independent quality gate.

---

# 2. Read every user issue first

Create an issue ledger before editing:

| ID | User issue | System area | Suspected area | Reproduction | Status |
|---|---|---|---|---|---|

Do not begin fixing the first issue while ignoring later issues.

Pay attention to clues such as "also", "strangely", "only", "after",
"sometimes", and "this breaks", because they often expose dependency chains.

Do not merge issues merely because they look similar. Merge only after proving
a common root cause.

---

# 3. Evidence-first tooling and automation

## Core rule

**Use the strongest available machine-verifiable tool or external capability
before manually reasoning through work that the tool can perform more
accurately, completely, or efficiently.**

This applies to every stage:

- reconnaissance
- reproduction
- root-cause tracing
- dependency analysis
- static analysis
- debugging
- editing
- testing
- refactoring
- performance analysis
- security analysis
- accessibility analysis
- runtime verification
- final auditing

The objective is not "use tools because tools exist." The objective is to
obtain stronger evidence with less unnecessary manual reasoning.

## Tool categories

Depending on the language, framework, platform, and environment, appropriate
tools may include:

### Compilation and type analysis

- compilers
- interpreters
- type checkers
- language servers
- symbol/indexing tools

Examples: `pyright`, `mypy`, `tsc`, Rust compiler/checker tooling, Java/Kotlin
compiler diagnostics, C/C++ compiler diagnostics, and equivalent tools.

### Static analysis

- linters
- AST analyzers
- code-quality analyzers
- data-flow analyzers
- dead-code analyzers
- dependency analyzers

### Testing

- unit-test frameworks
- integration tests
- end-to-end tests
- property-based tests
- fuzzers
- mutation testing
- snapshot tests
- contract tests

Examples include `pytest` and equivalents in the project's ecosystem.

### Runtime debugging

- debuggers
- stack traces
- runtime logs
- tracing
- instrumentation
- sanitizers
- memory checkers
- race/concurrency detectors

### Performance

- profilers
- CPU/memory profilers
- flame graphs
- benchmarks
- tracing systems
- allocation analysis
- browser performance tooling where applicable

### Security

When security is relevant and appropriate:

- static security analyzers
- dependency vulnerability scanners
- secret scanners
- permission/configuration analyzers
- fuzzing
- runtime security diagnostics

Do not perform intrusive testing against systems without authorization.

### Repository and dependency analysis

- `git diff`
- `git blame`
- `git log`
- `git bisect`
- `rg`
- AST search
- dependency graphs
- package-manager tooling
- build-system diagnostics

### Data and database systems

When relevant:

- schema validators
- query analyzers
- migration tools
- database explain/query-plan tools
- integrity checks
- generated fixtures

### UI/platform-specific tooling

Only when relevant:

- browser automation
- DOM inspection
- accessibility analyzers
- mobile UI test tooling
- platform-specific profilers
- rendering diagnostics
- Canvas diagnostics

These are examples, NOT mandatory dependencies.

Use the best equivalent tools actually available.

---

# 4. Tool capability limitations

Tool availability is environment-dependent.

If a useful tool, website, analyzer, browser, package, API, runtime, external
service, compiler, debugger, or profiler cannot be accessed because of:

- platform restrictions
- permissions
- missing dependencies
- network restrictions
- safety restrictions
- licensing restrictions
- unavailable credentials
- unsupported runtime
- resource limits

then:

1. Never claim the capability was used.
2. Determine whether an accessible equivalent exists.
3. Use the equivalent if it provides meaningful evidence.
4. Otherwise gracefully skip that capability.
5. Continue with the strongest available method.
6. Document the limitation when it materially affects confidence.

Do not waste large amounts of reasoning attempting to simulate unavailable
tool output.

---

# 5. Generated inputs and automation

Programmatically generate repetitive, large, random, structured, malformed,
boundary, or machine-friendly inputs.

Examples:

- test records
- JSON
- CSV
- SQL fixtures
- random IDs
- boundary values
- malformed inputs
- thousands of records
- concurrency workloads
- API payloads
- browser matrices
- performance workloads
- fuzzing inputs

Use deterministic seeds when reproducibility matters.

This is one application of the broader evidence-first principle and is NOT
limited to testing.

---

# 6. Discover and reuse specialized skills

The core skill is universal. Specialized skills are activated only when the
project or issue requires them.

Before specialized implementation, discover available skills.

## Web UI/UX

If a Web UI/UX Audit skill is installed/available and the issue touches UI/UX,
use its principles and procedures.

Relevant examples:

- spacing
- padding/margin
- alignment
- browser-native controls
- touch targets
- responsive behavior
- desktop/tablet/mobile
- portrait/landscape
- navigation
- direct tap-to-enter
- selection behavior
- transitions
- accessibility
- theming
- notifications
- sidebars
- toolbars
- bottom bars

Do not apply web UI rules to non-web software.

## Canvas

If Canvas/rendering is present:

1. Search for `canvas_xd.md`.
2. If present, read it before investigating Canvas-related bugs.
3. If absent and an appropriate Canvas skill is available, read that skill and
   create `canvas_xd.md` before Canvas investigation.
4. Use it as the local Canvas contract.

Do not invent Canvas architecture when Canvas is absent.

## Other specialized skills

When available, reuse specialized skills for relevant areas such as:

- databases
- mobile
- security
- performance
- accessibility
- cloud/deployment
- language-specific analysis
- build systems
- testing
- API design
- graphics/rendering
- other domain-specific engineering

Never force an unrelated specialized skill into a project.

---

# 7. Repository reconnaissance

Before modification, identify what actually exists:

- languages
- frameworks
- package managers
- build systems
- test systems
- entry points
- modules/packages
- services
- routes/endpoints where applicable
- shared components
- state management
- API/data layers
- persistence
- event architecture
- concurrency model
- lifecycle
- browser/platform APIs where applicable
- Canvas/rendering where applicable
- generated output
- deployment configuration

Use project-native tooling and repository search to map the architecture.

---

# 8. Deep root-cause tracing

Every issue gets an isolated investigation.

For each bug:

1. Reproduce the trigger.
2. Record expected behavior.
3. Record actual behavior.
4. Locate the entry point.
5. Trace control flow.
6. Trace state flow.
7. Trace data flow.
8. Trace I/O.
9. Trace rendering/output where relevant.
10. Trace navigation where relevant.
11. Trace persistence where relevant.
12. Trace lifecycle.
13. Trace concurrency/async behavior where relevant.
14. Trace dependencies.
15. Identify the earliest incorrect state or decision.
16. Identify the root cause.
17. Identify downstream effects.
18. Validate the hypothesis with available tools.

## Backward trace

Move from:

symptom -> output -> consumer -> handler/function -> state/data transformation
-> dependency/service -> input/configuration/initialization

Ask:

- Where did the incorrect value first appear?
- Who created it?
- Who transformed it?
- Who cached it?
- Who consumed it?
- Which assumption became false?

## Forward trace

After finding the suspected root:

- find every consumer
- inspect derived state
- inspect side effects
- inspect persistence
- inspect caches
- inspect events
- inspect other modules
- inspect platform-specific paths

Document:

`root cause -> observed symptom`

and:

`root cause -> other affected consumers`

---

# 9. Chain-bug analysis

Explicitly search for:

`Bug A -> intermediate state/symptom -> Bug B -> user-visible symptom C`

Examples:

- incorrect state -> stale cache -> incorrect output
- duplicate event handler -> double mutation -> duplicate records
- incorrect parser -> malformed internal object -> downstream crash
- wrong coordinate transform -> wrong hit test -> wrong object mutation
- race condition -> stale write -> corrupted derived state
- failed cleanup -> retained listener -> duplicate callback -> memory growth

Fix the primary root first, then verify downstream symptoms.

---

# 10. Cross-dependency tracing

For every changed shared function/module/class/component:

1. Find all imports/callers/subclasses/implementations.
2. Identify differing contracts.
3. Identify platform/language variants.
4. Identify hidden or dynamic consumers.
5. Identify tests.
6. Identify generated references.
7. Use static dependency/type tooling where available.

For public/shared APIs, inspect:

- callers
- argument contracts
- return contracts
- error behavior
- side effects
- lifecycle assumptions
- compatibility requirements

For state changes:

- initialization
- hydration
- persistence
- refresh/reload
- derived state
- caching
- concurrency
- optimistic updates

---

# 11. Fix hierarchy

Use the smallest level that safely removes the root cause.

### Level 1 — Shared root fix

Fix the common primitive/helper/state transition when proven responsible.

### Level 2 — Local surgical fix

Change only the unique implementation when behavior is intentionally local.

### Level 3 — Targeted refactor

Extract a helper/module/component when structure prevents a safe fix or creates
meaningful duplication.

### Level 4 — Subsystem revamp

Replace/restructure a broken subsystem when its architecture prevents a safe
fix.

### Level 5 — Complete rewrite

Use only when preserving the existing subsystem is demonstrably less safe,
correct, maintainable, or efficient than replacing it.

A rewrite is an evidence-based engineering decision, never a shortcut.

---

# 12. Surgical file editing

DO NOT rewrite entire source files in chat merely because they changed.

If two lines require changing, do not regenerate a 1000-line file.

Prefer:

- patch files
- CLI edits
- Python/Node/shell scripts
- AST codemods
- project-native migration tools
- targeted search-and-replace with uniqueness assertions

After every edit:

1. inspect the diff
2. verify intended lines changed
3. verify unrelated lines did not change
4. run targeted validation

Never perform a blind global replacement when the target is ambiguous.

Use structural anchors or AST-aware editing when necessary.

---

# 13. Full-file replacement exception

Whole-file replacement is acceptable only when:

- the file is generated and regeneration is correct
- it is genuinely a tiny replaceable module
- the subsystem is structurally irreparable
- a complete subsystem revamp is justified
- an automated codemod necessarily rewrites it
- migration requires structural replacement

Even then, preserve external contracts, inspect the diff, and run regression
verification.

---

# 14. Dead-code removal

After each fix, search for code made obsolete.

Remove where safe:

- unused imports
- obsolete helpers
- unreachable branches
- old handlers
- stale state
- duplicate constants
- dead configuration
- obsolete feature flags
- abandoned implementations
- dead tests
- obsolete compatibility code
- generated artifacts only when the build system permits it

Use static analysis where available.

Do not remove dynamic/public/compatibility code without evidence.

---

# 15. Duplication and reusable abstractions

Search for duplicated:

- handlers
- state transitions
- validation
- parsing
- rendering
- navigation
- API calls
- persistence
- notifications
- dialogs
- CSS
- constants
- algorithms

Prefer:

`one behavior -> one authoritative implementation`

when the behavior truly has a shared contract.

Do not create giant abstractions merely to eliminate superficial similarity.

---

# 16. File-size and module splitting

Use:

- under 800 lines: preferred
- 800–1200: warning / architectural inspection
- over 1200: unacceptable by default and requires module-splitting analysis

For hot paths and high-change code, split earlier when it improves:

- performance isolation
- lifecycle ownership
- testability
- dependency clarity
- surgical fix efficiency

Split by responsibility, cohesion, and dependency boundaries—not arbitrary
line counts.

---

# 17. Architecture and lifecycle

When relevant, inspect:

- ownership
- initialization
- teardown
- resource cleanup
- event subscriptions
- threads/tasks
- async operations
- cancellation
- caches
- global state
- dependency injection
- error propagation
- retry behavior
- transaction boundaries
- serialization
- persistence
- external service contracts

Look for bugs caused by incorrect lifecycle ownership rather than merely
incorrect individual lines.

---

# 18. Concurrency and async bugs

When the system is concurrent or asynchronous, explicitly check:

- race conditions
- ordering assumptions
- stale reads
- duplicate execution
- lost updates
- deadlocks
- starvation
- cancellation
- timeout behavior
- retry multiplication
- idempotency
- locking
- atomicity
- task cleanup

Use race detectors, concurrency tests, tracing, stress tests, or equivalent
tools when available.

---

# 19. Error handling

Check:

- swallowed exceptions/errors
- incorrect error conversion
- misleading messages
- missing cleanup
- partial mutations
- retry loops
- inconsistent rollback
- invalid fallback behavior
- error-state persistence
- logging gaps

Do not "fix" an error by hiding it.

---

# 20. Performance

Use actual measurements whenever possible.

Reference interaction/frame budgets where relevant:

- 8.3 ms per frame at 120 Hz
- 16.7 ms per frame at 60 Hz
- ~100 ms for instantaneous-feeling response
- 200–300 ms for snappy transitions
- 300–500 ms for deliberate transitions
- ~1 s begins interrupting thought
- ~10 s commonly loses attention

For non-UI software, use domain-appropriate latency, throughput, memory, CPU,
I/O, startup, and concurrency measurements rather than blindly applying UI
budgets.

Prefer profilers, benchmarks, traces, and measurements over guesses.

---

# 21. Specialized web UI/UX path

Only activate this section when the project is a web UI and the issue is
relevant.

Check:

- spacing
- padding/margin
- alignment
- optical alignment
- touch targets
- responsive behavior
- desktop/tablet/mobile
- portrait/landscape
- browser-native UI
- tap highlight
- selection color
- focus
- direct tap-to-enter
- transitions
- notifications
- sidebars
- toolbars
- bottom bars
- accessibility

If the dedicated Web UI/UX Audit skill exists, use it.

Preserve semantic HTML and accessibility when replacing browser-native
presentation.

---

# 22. Canvas/rendering path

Only activate when Canvas or equivalent rendering is present.

Inspect:

- render-loop ownership
- frame scheduling
- cleanup
- event listeners
- coordinate transforms
- device pixel ratio
- resize handling
- hit testing
- pointer/touch mapping
- object iteration
- allocations in hot paths
- full versus selective redraw
- stale references
- hidden/offscreen work
- GPU/CPU boundaries where applicable

Follow `canvas_xd.md` or the installed Canvas skill when available.

---

# 23. Security path

Only when security is relevant.

Use authorized, appropriate tooling to inspect:

- injection
- authentication
- authorization
- secrets
- unsafe deserialization
- dependency vulnerabilities
- path traversal
- command execution
- data exposure
- insecure defaults
- permission boundaries
- cryptographic misuse

Never perform unauthorized intrusive testing.

---

# 24. Automated verification

Prefer automation whenever a reliable tool can answer the question.

Use, when available and appropriate:

- compiler
- type checker
- linter
- static analyzer
- unit tests
- integration tests
- end-to-end tests
- property tests
- fuzzers
- debugger
- runtime instrumentation
- sanitizers
- race detectors
- browser automation
- accessibility analyzers
- profiler
- benchmark
- dependency analyzer
- security scanner
- database tooling
- AST tooling
- build system
- package manager
- Git tooling
- project-specific validation

If a tool is unavailable, do not fabricate its result.

---

# 25. Verification protocol

For each fix:

1. Reproduce the original bug.
2. Apply the fix.
3. Re-run the exact reproduction.
4. Confirm expected behavior.
5. Run affected tests.
6. Run tests for shared dependencies.
7. Check neighboring workflows.
8. Check platform variants where relevant.
9. Check accessibility where relevant.
10. Check performance where relevant.
11. Inspect the diff.
12. Search for stale/duplicate code.
13. Run independent machine-verifiable checks where available.

---

# 26. Junior-to-senior handoff

Provide:

- original issue ledger
- root-cause map
- backward traces
- forward-impact map
- chain-bug map
- changed files
- concise fix summary
- tests/results
- tooling/evidence used
- known limitations
- unresolved uncertainty

This evidence informs Auditor 2 but does not replace independent verification.

---

# 27. Senior audit from scratch

Senior sequence:

### A. Original problem review

Read the original user report, not just the junior report.

### B. Fresh reproduction

Attempt original failures independently.

### C. Fresh root tracing

Trace control/state/data/I/O/render/navigation/lifecycle/concurrency paths
independently as relevant.

### D. Independent tooling

Use available compilers, analyzers, tests, debuggers, browser tools,
profilers, security analyzers, or other appropriate tooling independently.

### E. Consumer audit

Search all consumers of changed code.

### F. Regression audit

Test workflows sharing changed implementations.

### G. Specialized audit

Activate only the relevant domain-specific checks.

### H. Architecture audit

Check:

- duplication
- dead code
- file size
- module boundaries
- hidden coupling
- lifecycle
- contracts
- maintainability
- performance implications

### I. Final gate

PASS only if:

- every original issue is resolved
- chain symptoms are resolved
- no material regression exists
- relevant consumers remain correct
- obsolete code is removed
- relevant specialized skills were used
- tests/tool evidence support the result

Otherwise FAIL.

---

# 28. Senior FAIL loop

If Senior Auditor finds a meaningful problem:

1. Record exact finding.
2. Classify it as missed bug, incomplete root fix, regression, chain bug,
   architecture problem, dead code, tooling gap, test gap, or other defect.
3. Return to Auditor 1.
4. Repair.
5. Re-run targeted verification.
6. Re-run Senior Auditor from scratch.

Repeat until PASS or a documented external limitation prevents completion.

---

# 29. No self-review shortcut

Invalid:

`Junior finds -> Junior fixes -> Junior says fixed -> PASS`

Required:

`Junior investigates -> Junior fixes -> Junior verifies`
`-> Senior independently investigates -> Senior verifies`
`-> PASS or FAIL -> repair loop`

---

# 30. Final output

Do not dump entire source files into chat.

Prefer:

- concise issue/fix summary
- changed files
- tests/tooling used
- Senior Auditor PASS/FAIL
- important caveats
- patched artifact when applicable

Show only relevant changed fragments when code excerpts are needed.

Hand over a completed patched artifact only after Senior Auditor PASS unless
the user explicitly requests an intermediate/debug artifact.

---

# 31. Final acceptance gate

Complete only when:

- all user issues were read
- all issues were investigated
- each root cause was traced
- backward impacts were checked
- forward impacts were checked
- chain bugs were checked
- cross-dependencies were checked
- relevant specialized skills were reused
- unavailable tools were not falsely represented
- material tooling limitations were documented
- fixes were surgical unless a larger change was justified
- dead code was removed
- duplicate behavior was rationalized
- affected consumers were regression-tested
- relevant platform variants were checked
- original reproductions pass
- targeted tests pass
- relevant machine-verifiable evidence was gathered where available
- Senior Auditor independently reviewed from scratch
- Senior Auditor PASSed the patched artifact

Only then is the task complete.
