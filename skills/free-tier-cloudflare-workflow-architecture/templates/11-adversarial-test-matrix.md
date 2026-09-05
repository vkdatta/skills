# Template: adversarial tests

## Limits
- [ ] step CPU just below 10 ms
- [ ] step CPU just above 10 ms
- [ ] non-stream result just below 1 MiB
- [ ] non-stream result just above 1 MiB
- [ ] persisted state near 100 MB
- [ ] 1,024-step boundary
- [ ] 100 concurrent instance boundary
- [ ] 100 creation/sec boundary
- [ ] 50 external subrequest boundary
- [ ] 1,000 internal subrequest boundary
- [ ] 128 MB memory pressure
- [ ] 100 MB request body boundary

## R2
- [ ] tiny object single PUT
- [ ] object around 5 MiB
- [ ] object around 5 GiB
- [ ] multipart with final <5 MiB
- [ ] >10,000 multipart-part calculation rejected
- [ ] duplicate same-key write
- [ ] concurrent same-key write
- [ ] abandoned multipart upload
- [ ] checksum mismatch

## Distributed failures
- [ ] worker retry
- [ ] workflow replay
- [ ] duplicate batch
- [ ] missing marker
- [ ] stale marker
- [ ] partial wave
- [ ] merge retry
- [ ] client disconnect
- [ ] malformed job
- [ ] zero-row job
- [ ] maximum-size job
