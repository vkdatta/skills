# Template: Klines-inspired mapping

Klines component -> generic role

DataFetchWorkflow:
  generic: coordinator
  job: plan source + partitions + waves

FanOutWorkflow:
  generic: bounded wave controller
  job: launch and supervise a small group

BatchWorker:
  generic: atomic computation unit
  job: fetch -> compute -> stage -> write

R2 stage objects:
  generic: durable intermediate data plane
  examples:
    - stage-bmr
    - stage-warmup
    - stage-forward
    - stage-rows

Completion marker:
  generic: durable wave completion signal

MergeWorker:
  generic: bounded reduction + finalization

Important:
Do not copy Klines constants blindly.
Measure and derive them for the new workload.
