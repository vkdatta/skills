# @vkdatta/skills

Portable AI skills by VK Datta, distributed through npm and managed with the `vkd-skills` CLI.

## Install

```bash
npm i -g @vkdatta/skills
```

## CLI

```bash
vkd-skills
vkd-skills list
vkd-skills add
vkd-skills add <skill>
vkd-skills remove
vkd-skills update
vkd-skills installed
vkd-skills info <skill>
vkd-skills search architecture
vkd-skills path
vkd-skills doctor
vkd-skills export <skill>
vkd-skills export <skill> --zip
vkd-skills version
```

`vkd-skills` installs selected skills into `./skills/<skill>/` in the current project. Existing skills are never overwritten by `add`; use `update` explicitly. The installed skill files are ordinary portable files and can be committed to the project or uploaded to an AI host.