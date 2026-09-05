# @vkdatta/skills

**Portable skills for AI coding agents.**

`@vkdatta/skills` is a collection of reusable, filesystem-based skills designed to give AI agents specialized instructions, workflows, engineering rules, and problem-solving methods.

Install the skills you need, keep them inside your project, inspect them, update them, export them, and use them with the AI environment of your choice.

No lock-in. No proprietary runtime. **Just portable skill files.**

## Install

```bash
npm i -g @vkdatta/skills
```

Then run:

```bash
vkd-skills
```

## What is a skill?

A skill is a self-contained set of instructions that teaches an AI agent **how to approach a specific class of work**.

Skills can encode things like:

- Architecture and design principles
- Coding and implementation workflows
- Debugging and bug-audit procedures
- Testing strategies
- UI/UX rules
- Research methods
- Project-specific engineering practices
- Validation and quality gates
- Repeatable problem-solving workflows

Because skills are ordinary files, they can be inspected, version-controlled, modified, shared, or moved between AI tools.

## CLI

### Discover

```bash
vkd-skills list
vkd-skills search architecture
vkd-skills info <skill>
```

### Install

```bash
vkd-skills add
vkd-skills add <skill>
```

### Manage

```bash
vkd-skills installed
vkd-skills update
vkd-skills remove
```

### Inspect

```bash
vkd-skills path
vkd-skills doctor
```

### Export

```bash
vkd-skills export <skill>
vkd-skills export <skill> --zip
```

### Version

```bash
vkd-skills version
```

## Project-local by design

When you add a skill, `vkd-skills` installs it into:

```text
./skills/<skill>/
```

The skill becomes part of the current project rather than being hidden inside the CLI.

That means you can:

- Read exactly what the AI is being instructed to do
- Commit skills alongside your code
- Review skill changes through Git
- Customize skills for your project
- Copy skills to another project
- Upload them to an AI host
- Share them with other developers or agents

## Safe installation

`add` does **not** silently overwrite an existing skill.

If a skill is already installed, use:

```bash
vkd-skills update <skill>
```

when you intentionally want to replace it with the latest version.

## Portable by nature

The goal is simple:

> **A skill should not belong to the CLI that installed it.**

`vkd-skills` is the distribution and management layer. The actual skills remain ordinary portable files that can live independently inside a project.

This makes the same skill usable across different AI agents and development environments without rebuilding the skill for each platform.

## Export and share

Export a skill as files:

```bash
vkd-skills export <skill>
```

Or create a ZIP:

```bash
vkd-skills export <skill> --zip
```

This makes it easy to move a skill between projects, machines, repositories, or AI environments.

## Philosophy

AI agents are powerful, but capability alone does not guarantee a reliable workflow.

A good skill turns accumulated engineering knowledge into a **repeatable operating procedure**.

Instead of repeatedly explaining:

- how a problem should be investigated,
- what must be checked,
- which mistakes to avoid,
- how results should be validated,
- and what quality bar must be met,

encode that knowledge once as a skill and make it reusable.

**Write the workflow once. Give it to every agent.**

---

## License

See the repository license for usage and distribution terms.
