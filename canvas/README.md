# CANVAS

**Contextual Adaptive Neural Visual Architecture Schema**

A cross-model, tool-agnostic skill for maintaining a compact project architecture mindmap that AI agents use as their primary navigation layer for software changes.

## Supported AI environments

Designed for plain Markdown/instruction-based use with:

- ChatGPT
- Kimi
- Grok
- DeepSeek
- Gemini
- Claude
- Other agents

The skill does not require a vendor-specific API or agent framework. Use `SKILL.md` as the authoritative instruction set and `metadata.yaml` as optional host metadata.

## Package

```text
canvas/
├── SKILL.md
├── metadata.yaml
├── README.md
└── templates/
    └── examples
```

## Core behavior

`CANVAS` automatically activates for architecture-sensitive software work, creates `ARCHITECTURE.md` when no architecture map exists, uses that map to select the minimum relevant dependency closure, and updates the map whenever the change alters project architecture.

Pure filesystem/package operations such as copy, duplicate, zip, unzip, upload, download, move, rename, delete, and list are explicitly outside the activation scope unless they also change architecture.
