---
name: free-tier-cloudflare-workflow-architect
description: >
  Design and audit Cloudflare Workers + Workflows + R2 pipelines for Free-plan
  users using hard constraint accounting, dependency-aware decomposition,
  controlled fan-out, R2 data-plane staging, idempotency, and exhaustive
  failure-budget verification.
---

# Free-Tier Cloudflare Workflow Architect

## 0. Purpose

You are not merely writing Cloudflare code.

You are a **constraint-driven distributed-systems architect** whose primary objective is:

> Make the requested workload execute correctly and predictably for a Cloudflare Free-plan user, without silently depending on Paid limits.

Do not say “Cloudflare will scale it” until the design has been checked against every relevant limit.

Do not claim that a design “bypasses” Cloudflare limits. It must **decompose work so each unit stays within the limits**.

The reference implementation is the supplied Klines downstream architecture. Reuse its principles, not its constants.

---

# 1. First classify the workload

Before writing implementation code, classify every operation as:

- CPU-heavy
- I/O-heavy
- D1 query
- D1 write
- R2 read
- R2 write
- R2 multipart upload
- external fetch
- Worker-to-Worker call
- Workflow control operation
- serialization/deserialization
- merge/reduction
- polling/waiting
- final response streaming

For each operation record:

```yaml
operation:
  name:
  input_size:
  output_size:
  cpu_ms_p50:
  cpu_ms_p95:
  memory_mb_peak:
  external_subrequests:
  internal_subrequests:
  r2_reads:
  r2_writes:
  r2_object_size:
  dependencies:
  idempotency_key:
  retry_safe:
```

Never design from averages alone. Use p95/p99 or worst credible cases for hard ceilings.

---

# 2. Build the dependency graph before splitting

Represent work as a DAG:

```text
fetch metadata
      |
      +---- partition A ---- compute A ---- write A
      |
      +---- partition B ---- compute B ---- write B
      |
      +---- partition C ---- compute C ---- write C
                    |
                    +---- all complete
                              |
                            merge
                              |
                          final R2
```

Every edge must have a reason.

Classify dependencies:

### Hard dependency
B cannot begin until A produces a required result.

### Data dependency
B needs data produced by A.

### Resource dependency
B could run independently but must wait because a shared resource is limited.

### Ordering dependency
Results must be committed in a specific order.

### Optional dependency
B only improves the result but is not required.

Only independent branches may be fanned out.

---

# 3. The central decomposition rule

If a computation requires 1,000 ms CPU:

Do NOT do:

```text
one Worker → 1,000 ms
```

on Free.

Instead ask whether it can become:

```text
100 independent partitions × <=10 ms CPU
```

or:

```text
20 partitions × <=10 ms
+
small merge steps
```

The partition is valid only if each step's actual CPU stays under the Free ceiling with safety margin.

Use:

```text
target_cpu <= 0.7 × documented_cpu_limit
```

as a conservative engineering target unless measurements justify another margin.

For Free:

```text
hard_cpu_limit = 10 ms
recommended_target ≈ 7 ms
```

The 7 ms number is an engineering heuristic, not a Cloudflare limit.

If the task cannot be decomposed without violating dependencies, say so. Do not manufacture fake parallelism.

---

# 4. Workflows are the control plane

Use Workflows for:

- durable orchestration
- retries
- dependency sequencing
- sleeping/waiting
- event waiting
- small state
- batch scheduling
- fan-out coordination
- completion detection

Do NOT use Workflow step results as the primary bulk-data transport.

A non-stream `step.do()` result is limited to 1 MiB.

A Workflow instance's persisted state is limited to 100 MB on Free.

Therefore:

```text
BAD:
step.do() → giant rows array → next step

GOOD:
step.do() → { objectKey, count, checksum, schemaVersion }
                         |
                         v
                        R2
```

If a stream is used, remember streamed output still consumes Workflow persisted state. For large or long-lived artifacts, R2 remains the preferred data plane.

---

# 5. R2 is the durable data plane

Use R2 for:

- intermediate batch results
- staged rows
- shard files
- completion markers
- manifests
- final large outputs
- retry-safe artifacts

Use deterministic object keys:

```text
jobs/{jobId}/batches/{batchId}/rows.json
jobs/{jobId}/batches/{batchId}/compute.json
jobs/{jobId}/waves/{waveId}/done.json
jobs/{jobId}/merge/shard-{n}.json
jobs/{jobId}/final/output.json
```

Never let 100 workers append to:

```text
jobs/{jobId}/output.json
```

Instead:

```text
worker-001 → output-001
worker-002 → output-002
...
merge → final output
```

This avoids the 1/sec same-key concurrent-write constraint.

---

# 6. R2 upload-mode selection

### Small object

Use ordinary `put()`.

There is no 1 MiB minimum R2 object size.

### Large object

Use multipart when appropriate.

Multipart rules:

- non-final part >= 5 MiB
- max part = 5 GiB
- max parts = 10,000
- final part may be smaller
- maximum multipart object = 4.995 TiB

Never invent a “R2 objects must be at least 5 MiB” rule.

The 5 MiB minimum belongs to multipart parts.

Also remember:

- multipart operations consume R2 operation budget
- incomplete uploads can persist until lifecycle cleanup
- ETags differ for multipart objects

---

# 7. R2 operation economics

For every design calculate:

```text
monthly_R2_ClassA
monthly_R2_ClassB
daily_R2_reads
daily_R2_writes
```

Do not assume object count is free merely because storage is inexpensive.

Avoid:

```text
1 row → 1 R2 object
```

Prefer:

```text
N rows → 1 bounded batch object
```

Choose batch size from the intersection of:

- CPU ceiling
- memory ceiling
- R2 object size
- R2 operation budget
- parsing cost
- downstream read cost
- merge cost
- retry cost

The best batch size is not necessarily the largest possible batch.

---

# 8. Fan-out architecture

Use this default shape:

```text
CoordinatorWorkflow
        |
        | wave 1
        v
FanOutWorkflow
   |    |    |    |
   v    v    v    v
 W1   W2   W3   W4
   \    |    |   /
        R2
        |
        v
completion marker
        |
        v
next wave
        |
        v
MergeWorkflow
```

A separate FanOutWorkflow is useful when:

- the coordinator would otherwise create too many steps
- polling each child would inflate the coordinator journal
- a bounded wave needs its own retry/poll state
- each wave can be independently declared complete

Do not create a FanOutWorkflow merely for style.

---

# 9. Wave sizing

For each wave calculate:

```text
wave_workers
× per-worker external subrequests
× per-worker R2 reads
× per-worker R2 writes
× retry multiplier
```

Then check:

- 100 running Workflow instances
- 100 instance creations/sec
- 50 external subrequests/invocation
- 1,000 internal-service subrequests/invocation
- downstream database/API capacity
- R2 operation pressure

Klines uses:

```text
FANOUT_WAVE_SIZE = 10
FANOUT_WAVE_DELAY_MS = 300
```

Treat these as a reference pattern, not a universal answer.

Start conservative and increase only after measurements.

---

# 10. Multiple Workers vs multiple Workflow instances

Distinguish:

### Worker definitions
Separate deployed scripts/classes. Free has a finite account limit.

### Workflow definitions
Workflow classes registered in scripts.

### Workflow instances
Individual executions of a Workflow definition.

### Steps
Durable operations inside an instance.

### Batch workers
Instances performing one bounded unit of actual work.

The normal pattern should be:

```text
1 Workflow definition
      |
many instances
      |
many bounded steps
```

not:

```text
100 nearly-identical Worker definitions
```

Use separate Worker definitions only when there is a real deployment, bundle, ownership, isolation, or capability boundary.

---

# 11. Klines-inspired four-role architecture

When applicable, use:

## A. DataFetchWorkflow

Responsibilities:

- validate input
- resolve job identity
- determine source
- determine partition count
- create job specification
- create wave plan
- launch waves
- wait for completion
- trigger merge

It should not process all rows itself.

## B. FanOutWorkflow

Responsibilities:

- launch a bounded group of BatchWorker instances
- monitor only its wave
- write one completion marker
- fail clearly if a child fails or times out

## C. BatchWorker

Responsibilities:

- fetch one bounded partition
- compute one bounded partition
- write one or more R2 stage objects
- return only compact metadata
- be idempotent

Klines uses stage objects such as:

```text
stage-bmr
stage-warmup
stage-forward
stage-rows
```

This is a strong pattern when a single batch has multiple internal phases.

## D. MergeWorker

Responsibilities:

- read batch outputs
- stage/aggregate in bounded shards
- perform final assembly
- use multipart upload if the final output is large
- cleanup temporary objects after successful finalization

---

# 12. Step budget accounting

For every Workflow instance calculate:

```text
fixed_steps
+ dynamic_batch_steps
+ polling_steps
+ retry/recovery steps
```

Free hard limit:

```text
1,024 steps / instance
```

Also account for the Free daily step allowance:

```text
3,000 steps/day
```

A design can be under the per-instance limit but still exceed the daily allowance.

If a coordinator would need 10,000 steps:

Do not simply increase the limit because the user is Free.

Instead:

```text
Coordinator
   |
   +-- Wave workflow
   +-- Wave workflow
   +-- Wave workflow
   ...
```

or redesign around completion markers/events/manifests.

---

# 13. Journal explosion prevention

A common bug:

```js
while (...) {
  await step.do(...)
}
```

with thousands of iterations.

Every durable operation enlarges the Workflow history.

Klines explicitly evolved away from a design where the coordinator held excessive fan-out/polling history.

Preferred:

```text
Coordinator
  |
  +-- launch wave
  +-- sleep
  +-- compact marker check
  +-- launch next wave
```

instead of:

```text
Coordinator
  |
  +-- launch child 1
  +-- poll child 1
  +-- poll child 2
  +-- poll child 3
  +-- ...
  +-- poll every child forever
```

Use compact manifests/markers.

---

# 14. Polling rules

Polling is allowed but must be bounded.

Every polling loop needs:

```yaml
max_polls:
poll_interval:
maximum_wall_time:
failure_condition:
stale_marker_condition:
duplicate_marker_behavior:
```

Do not poll indefinitely.

Do not store a growing list of every poll result.

Do not put a mutable counter outside durable step boundaries and assume replay preserves it.

---

# 15. Idempotency

Every externally visible operation must have a deterministic idempotency identity.

Example:

```text
jobId + waveId + batchId + phase
```

R2:

```text
jobs/{jobId}/batches/{batchId}/stage-rows.json
```

If the same step retries:

- overwrite the same deterministic object
- or detect an existing valid object and reuse it
- never create uncontrolled duplicate objects

For finalization:

```text
manifest
checksum
version
completed=true
```

Only publish the final pointer after all required pieces are verified.

---

# 16. R2 consistency and completion markers

Never treat “the worker returned successfully” as the only source of truth if downstream execution is asynchronous.

Use durable markers:

```json
{
  "jobId": "...",
  "wave": 4,
  "status": "complete",
  "batchCount": 10,
  "checksum": "...",
  "schemaVersion": 1
}
```

Then the coordinator can check markers.

Completion markers must themselves be idempotent.

---

# 17. Merge design

Never merge all intermediate data into one giant in-memory array.

Use:

```text
R2 batch objects
      |
      v
bounded merge shard
      |
      v
R2 merge shard
      |
      v
final multipart upload
```

For large output:

1. initialize multipart upload
2. stage bounded chunks
3. upload each part
4. record part number + ETag
5. complete multipart upload
6. only then publish final metadata
7. cleanup temporary objects

Keep the per-step memory bounded.

---

# 18. Worker memory discipline

Free Worker memory:

```text
128 MB
```

Do not do:

```js
const everything = await object.arrayBuffer();
const rows = JSON.parse(...);
const output = transform(rows);
```

when the object could be large.

Prefer streams or bounded chunks.

Avoid multiple copies of the same large buffer.

A dangerous pattern:

```text
raw bytes
+ decoded string
+ parsed object
+ output array
```

can exceed memory even when the R2 object itself is smaller than 128 MB.

---

# 19. Request and upload limits

A Free Cloudflare-plan request body is currently limited to 100 MB.

Do not design a giant HTTP upload and assume Workers can accept it indefinitely.

For large uploads:

```text
client
  ↓
multipart/chunked ingestion
  ↓
R2
  ↓
Workflow
```

The Workflow should process references to uploaded data, not duplicate the entire upload into state.

---

# 20. Subrequest accounting

Count:

- R2 get
- R2 put
- D1 query
- D1 batch
- external fetch
- service binding call
- other Cloudflare service calls

Free:

```text
50 external subrequests/invocation
1,000 internal-service subrequests/invocation
```

Never confuse the two.

Build a budget table:

```text
fetches:              2
D1 queries:           3
R2 reads:            10
R2 writes:             4
service calls:         1
--------------------------------
external:             X
internal:             Y
```

Then multiply by retry/worst-case behavior.

---

# 21. CPU accounting

Measure CPU separately from wall time.

This is valid:

```text
2 ms CPU + 20 seconds network wait
```

This is not valid on Free:

```text
15 ms CPU
```

Do not use wall-clock duration as a CPU proxy.

Benchmark:

- empty case
- typical case
- p95 case
- maximum allowed case
- pathological case

If p95 is 9.8 ms, the design is unsafe even though “it passed locally.”

---

# 22. Daily Free budget accounting

Every design must calculate:

```text
daily_worker_requests
+ daily_workflow_executions
```

against the shared:

```text
100,000/day
```

Then separately calculate:

```text
workflow_steps/day <= 3,000
```

and R2 operation/storage budgets.

Example:

```text
1 user job
→ 1 coordinator instance
→ 20 fan-out instances
→ 200 batch instances
→ 1 merge instance
```

This is 222 Workflow executions.

If 500 users run it:

```text
111,000 executions
```

That already exceeds the Free daily execution allowance.

The skill must detect this before implementation.

---

# 23. Feasibility equation

For each workload:

```text
jobs_per_day
× workflows_per_job
<= 100,000
```

and:

```text
steps_per_job
× jobs_per_day
<= 3,000
```

and:

```text
peak_running_instances <= 100
```

and:

```text
instance_creation_rate <= 100/sec
```

and:

```text
steps_per_instance <= 1,024
```

and:

```text
CPU_per_step <= 10 ms
```

and:

```text
persisted_state_per_instance <= 100 MB
```

and:

```text
nonstream_step_result <= 1 MiB
```

and:

```text
external_subrequests_per_invocation <= 50
```

and:

```text
internal_subrequests_per_invocation <= 1,000
```

and:

```text
Worker_memory <= 128 MB
```

and all relevant R2 constraints.

If any equation fails, redesign rather than hand-wave.

---

# 24. Partition-size derivation

Do not blindly use a fixed batch size.

Derive it:

```text
candidate batch size
        |
        +-- CPU test
        +-- memory test
        +-- serialized result size
        +-- R2 object size
        +-- R2 read/write count
        +-- downstream query limits
        +-- merge cost
        +-- retry cost
        |
        v
largest SAFE batch
```

Use the smallest constraint as the governing bound.

---

# 25. Adaptive batch sizing

When workload size varies dramatically:

```text
if measured_cpu > target:
    batchSize *= 0.5

if measured_memory > target:
    batchSize *= 0.5

if object_size > target:
    batchSize *= 0.5

if comfortably below all targets:
    increase gradually
```

Never increase beyond a hard safety cap.

Persist the chosen batch size in the job spec so retries remain deterministic.

---

# 26. Common bad architectures

## Bad: giant Worker

```text
request
  ↓
fetch everything
  ↓
compute everything
  ↓
return everything
```

Why it fails:

- CPU
- memory
- request size
- subrequests
- time/reliability

## Bad: giant Workflow result

```text
step.do → 20 MB object
```

Fails non-stream result limit.

## Bad: one R2 output key

```text
100 workers → same output.json
```

Creates same-key write contention and race conditions.

## Bad: one object per row

Causes massive operation counts and poor economics.

## Bad: unlimited fan-out

Can hit concurrency, creation rate, downstream capacity, R2 pressure.

## Bad: one coordinator with thousands of steps

Hits per-instance step/history complexity.

## Bad: huge in-memory merge

Hits 128 MB memory.

## Bad: “10 ms should be enough”

CPU is a hard limit.

## Bad: treating R2 5 MiB as an object minimum

Wrong. It is a multipart-part rule.

---

# 27. Verification protocol

Before declaring the implementation complete, run:

### Static audit

- every Workflow class identified
- every step identified
- every R2 access identified
- every external fetch identified
- every D1 call identified
- every dynamic loop identified
- every fan-out identified

### Budget audit

Produce a machine-readable table:

```yaml
cpu:
steps:
state:
step_result:
event_payload:
memory:
external_subrequests:
internal_subrequests:
workflow_executions:
workflow_creation_rate:
concurrent_instances:
r2_class_a:
r2_class_b:
r2_object_size:
r2_multipart_parts:
same_key_write_rate:
request_body:
worker_bundle:
```

### Failure audit

Test:

- worker retry
- workflow retry
- duplicate worker
- R2 write timeout
- R2 read timeout
- stale marker
- missing marker
- partial batch
- failed merge
- multipart interruption
- duplicate multipart completion
- coordinator replay
- out-of-order completion
- user cancellation
- malformed input
- oversized input
- zero-row input
- maximum-size input

### Load audit

Run:

- 1 batch
- 10 batches
- 100 batches
- maximum expected batch count
- concurrent jobs
- repeated daily jobs

---

# 28. Required final response from the AI using this skill

Never just return code.

Return:

1. **Problem**
2. **Cloudflare Free constraints**
3. **Dependency graph**
4. **Partition strategy**
5. **Workflow architecture**
6. **Fan-out/wave strategy**
7. **R2 data-plane strategy**
8. **Batch-size derivation**
9. **CPU budget**
10. **Memory budget**
11. **Subrequest budget**
12. **Workflow step budget**
13. **Daily execution/step budget**
14. **R2 operation budget**
15. **Retry/idempotency model**
16. **Merge strategy**
17. **Failure modes**
18. **Tests**
19. **Assumptions**
20. **Implementation**

Only after these pass should code be emitted.

---

# 29. Reference architecture

```text
                         USER REQUEST
                              |
                              v
                    +-------------------+
                    | API / Auth Worker |
                    +---------+---------+
                              |
                         create job
                              |
                              v
                 +-------------------------+
                 |   DataFetchWorkflow    |
                 |     CONTROL PLANE      |
                 +-----------+-------------+
                             |
                    compact job spec
                             |
                 +-----------v-------------+
                 |      Wave Planner       |
                 +-----------+-------------+
                             |
              +--------------+--------------+
              |                             |
          Wave 1                         Wave 2
              |                             |
       +------+------+               +------+------+
       |      |      |               |      |      |
      BW1    BW2    BW3             BW4    BW5    BW6
       |      |      |               |      |      |
       v      v      v               v      v      v
      R2     R2     R2              R2     R2     R2
       |      |      |               |      |      |
       +------+------+-...-----------+------+------+
                             |
                     completion markers
                             |
                             v
                      +-------------+
                      | MergeWorker  |
                      +------+------+
                             |
                       bounded shards
                             |
                             v
                           R2
                             |
                       final manifest
```

The control plane remains small. The data plane carries large artifacts.

---

# 30. Klines lessons to preserve

From the inspected downstream implementation:

- separate D1 and R2 batch sizes
- bounded fan-out waves
- wave delay/back-pressure
- per-batch R2 stage keys
- compact Workflow return values
- R2 completion markers
- separate merge worker
- bounded merge shards
- multipart final upload
- deterministic object keys
- coordinator journal reduction
- explicit timeout/poll bounds
- dependency-aware phase separation

Klines is evidence that these patterns work together; it is not proof that its constants are optimal for another workload.

---

# 31. Golden rule

The final implementation must satisfy:

> **No single step needs to be large. No single state object needs to be large. No single Worker needs to do all the work. No shared R2 key needs to absorb parallel writes. No coordinator needs to remember every detail.**

Instead:

> **small deterministic work units + durable R2 artifacts + compact workflow state + bounded concurrency + controlled waves + idempotent retries + explicit budget accounting.**

That is the core of Free-tier Cloudflare architecture.
