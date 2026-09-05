# Template: dependency and decomposition analysis

## Original operation
Describe the user's requested computation.

## Dependency graph
```text
INPUT
  |
  +--> A
  |     |
  |     +--> C
  |
  +--> B
        |
        +--> C
```

## Dependency table

| Unit | CPU | Input | Output | Depends on | Can parallelize? |
|---|---:|---|---|---|---|
| A | | | | | |
| B | | | | | |
| C | | | | | |

## Split rule
A unit may be split only if:
- its children have well-defined inputs
- retries are independently safe
- outputs can be addressed independently
- merge semantics are deterministic

## Result
- parallel units:
- sequential units:
- reduction/merge units:
- unsplittable units:
- reason:
