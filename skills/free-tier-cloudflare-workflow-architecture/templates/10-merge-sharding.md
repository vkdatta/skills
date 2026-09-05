# Template: bounded merge

inputs:
  batch_objects:
  total_rows:
  estimated_bytes:

merge:
  shard_target_bytes:
  max_rows_per_shard:
  max_memory_mb:
  max_cpu_ms:

pipeline:
```text
R2 batch objects
  -> bounded reader
  -> shard buffer
  -> R2 shard
  -> next shard
  -> multipart final upload
```

Never:
```text
all R2 objects -> one giant array -> JSON.stringify(all)
```
