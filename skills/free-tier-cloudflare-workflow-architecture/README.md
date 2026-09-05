# Free-Tier Cloudflare Workflow Architect

A hardcore architecture/audit skill for building **Cloudflare Workers + Workflows + R2 systems that remain viable for Free-plan users**.

## Mission

Normal application code tends to assume that a long computation can happen in one request, a workflow step can return a large value, a database can be queried in large batches, and many workers can write to one destination. Cloudflare Free does not permit those assumptions.

This skill turns platform limits into **design boundaries**:

- CPU → computation partitions
- step-result size → references instead of payloads
- Workflow state → bounded journals
- Worker memory → streaming/sharding
- subrequests → batch sizing
- Workflow concurrency → controlled fan-out
- instance creation rate → waves/back-pressure
- R2 same-key write rate → unique output keys
- R2 multipart rules → upload-mode selection
- R2 Class A/B operation budgets → object/batch economics
- step count → recursive/wave decomposition
- daily request/step budgets → workload feasibility math

## Klines reference pattern

The supplied `klines.zip` downstream implementation was inspected as a reference. Its notable design ideas include:

- `DataFetchWorkflow` as the coordinator
- `FanOutWorkflow` as a bounded wave launcher
- `BatchWorker` as the bounded work unit
- `MergeWorker` as the final assembly stage
- D1 batch sizing separate from R2 batch sizing
- fan-out waves (`FANOUT_WAVE_SIZE = 10`)
- a small inter-wave delay (`300 ms`)
- R2 stage objects such as `.stage-bmr.json`, `.stage-warmup.json`, `.stage-forward.json`, `.stage-rows.json`
- small Workflow control/state values instead of moving large datasets through step results
- R2 completion markers
- merge sharding before final assembly
- multipart R2 output for large final objects
- unique per-batch object keys to avoid same-key write contention
- bounded polling instead of an ever-growing coordinator journal

These values are **examples, not universal constants**. The skill must derive or benchmark them for the actual workload.

## Current Cloudflare facts used by this skill

Always re-check official docs before implementation because limits can change.

Current Free limits verified on 2026-09-06:

### Workers Free

- 100,000 requests/day
- 10 ms CPU/invocation
- 128 MB memory
- 50 subrequests/request
- 6 simultaneous outgoing connections waiting for response headers
- 64 environment variables
- 5 KB per environment variable
- 64 MiB uncompressed Worker size
- 1 second startup CPU budget
- 100 Workers/account
- 100 MB maximum incoming request body on the Free Cloudflare plan
- no general requests-per-second ceiling for Workers

Source:
https://developers.cloudflare.com/workers/platform/limits/

### Workflows Free

- 3 MB max script size inherited from the Workflow/Workers limits table
- 10 ms compute time per step
- unlimited wall-clock duration per step
- 1 MiB maximum non-stream step result
- 1 MiB maximum event payload
- 100 MB persisted state per Workflow instance
- 1,024 steps per Workflow instance
- 100,000 Workflow executions/day, shared with Workers daily limit
- 100 concurrent running Workflow instances/account
- 100 new instances/second/account
- 100,000 queued instances
- completed state retention: 3 days
- 50/request and 1,000 internal-service subrequest limits inherited from Free Workers
- waiting/sleeping/retry/event-waiting instances do not count toward running-instance concurrency
- JavaScript `ReadableStream<Uint8Array>` can be used for larger streamed step output, but streamed output still counts toward the 100 MB persisted-instance state limit

Source:
https://developers.cloudflare.com/workflows/reference/limits/

### Workflows pricing/budget

Current published Free allowance:

- 100,000 requests/day
- 10 ms CPU per invocation
- 1 GB-month Workflow storage allowance
- 3,000 steps/day

Source:
https://developers.cloudflare.com/workflows/reference/pricing/

Important: a platform limit and a billing allowance are different constraints. The architecture must satisfy both.

### R2

Current documented limits:

- unlimited storage per bucket
- unlimited object count
- object key: 1,024 bytes
- object metadata: 8,192 bytes
- object size: 5 TiB
- single-part upload: 5 GiB
- multipart upload: 4.995 TiB
- maximum multipart parts: 10,000
- maximum concurrent writes to the same object key: 1/second
- multipart part minimum: 5 MiB except final part
- multipart part maximum: 5 GiB
- incomplete multipart uploads are automatically aborted after 7 days by default

Sources:
https://developers.cloudflare.com/r2/platform/limits/
https://developers.cloudflare.com/r2/objects/upload-objects/

There is **no 1 MiB minimum R2 object size**. The 1 MiB boundary that commonly causes confusion is the Workflow non-stream step-result/event limit.

## Non-negotiable design doctrine

1. Never promise that Free can execute arbitrary CPU-heavy work by simply adding more steps.
2. Never treat `step.do()` as a 1-second CPU bucket. Free gives 10 ms CPU per step.
3. Split computation at semantic dependency boundaries.
4. Put large durable data in R2; put small references, counters, IDs, and state in Workflows.
5. Never use Workflow state as a bulk-data bus.
6. Prefer one Workflow definition with many instances/steps over many redundant definitions.
7. Fan out only independent work.
8. Use waves/back-pressure when fan-out could exhaust concurrency, creation rate, subrequests, R2 operations, or downstream capacity.
9. Give parallel workers distinct R2 object keys.
10. Never rely on a shared mutable R2 object for concurrent accumulation.
11. Use single PUT for small objects; multipart only when justified by size/reliability.
12. Do not confuse R2 object size with multipart part size.
13. Budget R2 Class A/B operations before selecting a partition size.
14. Budget Workflow steps before generating the graph.
15. Budget the global 100,000 requests/day ceiling across ordinary Worker requests and Workflow executions.
16. Treat 100 running Workflow instances as a concurrency ceiling, not a target.
17. Remember that waiting instances do not consume running-instance concurrency.
18. Make every step retry-safe and idempotent.
19. Never use nondeterministic mutable counters outside persisted step boundaries.
20. Never rely on “it usually finishes under 10 ms.” Measure CPU and include margin.
21. Never claim “zero bugs”; the skill's goal is systematic prevention and verification.
22. Test failure, retry, duplicate execution, partial R2 writes, stale markers, and merge recovery.

## Required deliverable behavior

When another AI uses this skill to design a system, it must produce:

- constraint ledger
- dependency graph
- computation partition plan
- data partition plan
- Workflow graph
- fan-out/wave plan
- R2 object/key plan
- operation budget
- CPU budget
- memory budget
- step budget
- concurrency budget
- daily request/step budget
- failure/retry/idempotency plan
- merge strategy
- observability plan
- adversarial test matrix
- explicit assumptions and measurements

Then it must audit its own proposal against every budget before presenting implementation code.
