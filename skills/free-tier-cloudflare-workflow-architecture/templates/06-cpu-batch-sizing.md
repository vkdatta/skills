# Template: CPU-derived batch sizing

hard_limit_ms: 10
engineering_target_ms: 7

measurements:
  batch_size_1:
    cpu_p50_ms:
    cpu_p95_ms:
    memory_mb:
    output_mib:
  batch_size_2:
    cpu_p50_ms:
    cpu_p95_ms:
    memory_mb:
    output_mib:

selection:
  chosen_batch_size:
  reason:
  safety_margin_ms:

rule:
"Choose the largest batch whose measured worst credible CPU, memory, output size,
subrequest count, and downstream operation cost all remain below their respective
limits with margin."
