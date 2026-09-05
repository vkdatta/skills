# @vkdatta/skills — GitHub + npm setup

This repository is both the source repository and the npm package `@vkdatta/skills`.

## 1. Install locally and verify

```bash
npm install
npm test
npm pack --dry-run
node ./bin/vkd-skills.js list
```

## 2. One-time npm bootstrap

The npm package must exist before npm Trusted Publishing can be configured.

Publish the current `0.0.1` package once from a machine where you are logged into npm:

```bash
npm login
npm publish --access public
```

Then create the matching Git tag **without pushing `main` again**:

```bash
git tag v0.0.1
git push origin v0.0.1
```

The release workflow only runs for pushes to `main`, so this bootstrap tag does not publish again.

## 3. Configure npm Trusted Publishing

On npmjs.com, open `@vkdatta/skills` → Settings → Trusted Publisher.

Choose **GitHub Actions** and configure:

- Organization or user: `vkdatta`
- Repository: `skills`
- Workflow filename: `autotag.yml`
- Allow `npm publish`

No npm token is stored in GitHub. The workflow uses GitHub OIDC (`id-token: write`) and npm Trusted Publishing.

## 4. Normal release flow

After the bootstrap, normal development is just:

```bash
git add .
git commit -m "feat: update canvas skill"
git push origin main
```

GitHub Actions then:

1. calculates the next SemVer version;
2. creates the matching Git tag, e.g. `v0.0.2`;
3. sets `package.json`/`package-lock.json` to `0.0.2`;
4. commits those version changes back to `main`;
5. creates and pushes the matching `v0.0.2` tag;
6. runs tests and package validation;
7. publishes exactly `@vkdatta/skills@0.0.2` to npm.
The tag, `package.json`, `package-lock.json`, and npm package version are checked for exact equality before publishing.

## 5. CLI after installation

```bash
npm install -g @vkdatta/skills
```

Then, inside a project:

```bash
vkd-skills
vkd-skills list
vkd-skills add
vkd-skills add canvas
vkd-skills remove
vkd-skills remove canvas
vkd-skills update
vkd-skills update canvas
vkd-skills installed
vkd-skills info canvas
vkd-skills search architecture
vkd-skills path
vkd-skills doctor
vkd-skills export canvas
vkd-skills export canvas --zip
vkd-skills version
vkd-skills help
```

Selected skills are installed into `./skills/<skill>/` in the current project. In a TTY, use **Space** to select/unselect, **↑/↓** to move, **Enter** to confirm, and **0/Esc** to go back. `add` never overwrites an existing skill; use `update` explicitly.
