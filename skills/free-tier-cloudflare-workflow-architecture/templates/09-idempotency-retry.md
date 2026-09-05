# Template: retry/idempotency matrix

| Operation | Stable ID | Retry behavior | Duplicate-safe? | Recovery |
|---|---|---|---|---|
| fetch batch | job+batch | rerun | yes | overwrite/reuse |
| R2 stage write | object key | put same key | yes | verify checksum |
| completion marker | job+wave | put same key | yes | verify |
| multipart part | upload+part | repeat part | yes | replace/check ETag |
| final completion | job | conditional publication | yes | manifest gate |

## Requirements

Every operation must have:
- deterministic identity
- deterministic destination
- duplicate behavior
- timeout behavior
- recovery behavior
