#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import readline from 'node:readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const PACKAGE_SKILLS = path.join(PACKAGE_ROOT, 'skills');
const PROJECT_SKILLS = 'skills';

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function skillDirectories(base) {
  if (!(await exists(base))) return [];
  const entries = await fs.readdir(base, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => e.name)
    .sort();
}

async function packageVersion() {
  return (await readJson(path.join(PACKAGE_ROOT, 'package.json'))).version;
}

async function skillInfo(name, base = PACKAGE_SKILLS) {
  const dir = path.join(base, name);
  const metadata = path.join(dir, 'metadata.yaml');
  const readme = path.join(dir, 'README.md');
  const skill = path.join(dir, 'SKILL.md');
  if (!(await exists(skill))) return null;

  let description = '';
  if (await exists(metadata)) {
    const text = await fs.readFile(metadata, 'utf8');
    const m = text.match(/^description:\s*(.*)$/m);
    if (m) {
      const first = m[1].trim();
      if (first && first !== '>' && first !== '|') {
        description = first.replace(/^['"]|['"]$/g, '');
      } else {
        const lines = text.split(/\r?\n/);
        const idx = lines.findIndex(line => /^description:\s*[>|]?\s*$/.test(line));
        if (idx >= 0) {
          const continuation = [];
          for (const line of lines.slice(idx + 1)) {
            if (line.trim() && !/^\s+/.test(line)) break;
            if (/^\s{2,}\S/.test(line)) continuation.push(line.trim());
          }
          description = continuation.join(' ').trim();
        }
      }
    }
  }
  if (!description && await exists(readme)) {
    const text = await fs.readFile(readme, 'utf8');
    const m = text.match(/^#\s+(.+)$/m);
    if (m) description = m[1].trim();
  }
  return { name, description, path: dir };
}

function usage() {
  console.log(`\n@vkdatta/skills — vkd-skills\n\nUsage:\n  vkd-skills                         Interactive skill manager\n  vkd-skills list                    List all available skills\n  vkd-skills add [skill ...]         Add skills to ./skills\n  vkd-skills remove [skill ...]      Remove installed skills\n  vkd-skills update [skill ...]      Replace installed skills with package versions\n  vkd-skills installed               List skills installed in this project\n  vkd-skills info <skill>             Show skill details\n  vkd-skills search <term>            Search available skills\n  vkd-skills path                     Show project skill directory\n  vkd-skills doctor                   Check project/package setup\n  vkd-skills export <skill> [--zip]  Export a portable skill\n  vkd-skills version                  Show package version\n  vkd-skills help                     Show this help\n\nInteractive navigation:\n  0 / b / back / q                   Return to the main menu\n  Ctrl+C                              Exit\n`);
}

async function listAvailable() {
  const names = await skillDirectories(PACKAGE_SKILLS);
  if (!names.length) { console.log('\nNo skills found in package.\n'); return; }
  console.log('\nAvailable VKD skills:\n');
  for (const n of names) {
    const i = await skillInfo(n);
    console.log(`  ${n}${i?.description ? ` — ${i.description}` : ''}`);
  }
  console.log();
}

async function installed() {
  const names = await skillDirectories(path.resolve(PROJECT_SKILLS));
  console.log(`\nInstalled skills in ./${PROJECT_SKILLS}/:`);
  if (!names.length) console.log('  (none)');
  else names.forEach(n => console.log(`  ✓ ${n}`));
  console.log();
}

async function copyDir(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.cp(src, dest, { recursive: true, force: true, errorOnExist: false });
}

function isBack(value) {
  return ['0', 'b', 'back', 'q', 'quit', 'cancel', 'esc'].includes(value.trim().toLowerCase());
}

async function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: Boolean(process.stdin.isTTY && process.stdout.isTTY),
  });
  try {
    return String(await new Promise(resolve => rl.question(question, resolve))).trim();
  } finally {
    rl.close();
  }
}

/**
 * Interactive checkbox selector for real terminals.
 * Arrow keys move, Space toggles, Enter confirms, 0/Esc goes back.
 * A simple numbered fallback is retained for non-TTY environments/CI.
 */
async function interactiveSelect(title, names) {
  if (!names.length) {
    console.log(`\n${title}: none available.\n`);
    return { selected: [], back: true };
  }

  if (!(process.stdin.isTTY && process.stdout.isTTY)) {
    console.log(`\n${title}\n`);
    names.forEach((n, i) => console.log(`  ${i + 1}. ${n}`));
    console.log('\n  0. Back to main menu');
    const answer = await ask('\nEnter numbers separated by spaces (a = all, 0 = back): ');
    if (isBack(answer)) return { selected: [], back: true };
    if (answer.toLowerCase() === 'a') return { selected: names, back: false };

    const selected = [];
    for (const token of answer.split(/\s+/)) {
      const n = Number(token);
      if (Number.isInteger(n) && n >= 1 && n <= names.length) selected.push(names[n - 1]);
    }
    if (!selected.length) {
      console.log('\nNo valid selection. Returning to main menu.\n');
      return { selected: [], back: true };
    }
    return { selected: [...new Set(selected)], back: false };
  }

  const selected = new Set();
  let cursor = 0;
  const stdin = process.stdin;

  const render = () => {
    // Clear the screen and redraw the selector. ANSI is standard on the
    // interactive terminals supported by this CLI; non-TTY already uses the fallback above.
    process.stdout.write('\x1b[2J\x1b[H');
    console.log(`@vkdatta/skills\n\n${title}\n`);
    names.forEach((name, index) => {
      const marker = selected.has(name) ? 'x' : ' ';
      const pointer = index === cursor ? '❯' : ' ';
      console.log(`${pointer} [${marker}] ${name}`);
    });
    console.log('\n↑/↓ Move   Space Select/Unselect   Enter Confirm   0/Esc Back');
    console.log(`Selected: ${selected.size}/${names.length}`);
  };

  return await new Promise(resolve => {
    let finished = false;
    const finish = result => {
      if (finished) return;
      finished = true;
      try { stdin.setRawMode(false); } catch {}
      stdin.pause();
      stdin.removeListener('keypress', onKeypress);
      process.stdout.write('\x1b[2J\x1b[H');
      resolve(result);
    };

    const onKeypress = (str, key = {}) => {
      const name = key.name || str;
      if (name === 'up') {
        cursor = (cursor - 1 + names.length) % names.length;
        render();
        return;
      }
      if (name === 'down') {
        cursor = (cursor + 1) % names.length;
        render();
        return;
      }
      if (name === 'space') {
        const skill = names[cursor];
        if (selected.has(skill)) selected.delete(skill);
        else selected.add(skill);
        render();
        return;
      }
      if (name === 'return' || name === 'enter') {
        finish({ selected: names.filter(name => selected.has(name)), back: false });
        return;
      }
      if (name === 'escape' || name === 'q' || str === '0') {
        finish({ selected: [], back: true });
      }
    };

    stdin.setRawMode(true);
    stdin.resume();
    readline.emitKeypressEvents(stdin);
    stdin.on('keypress', onKeypress);
    render();
  });
}

async function add(names) {
  if (!names.length) {
    const selection = await interactiveSelect('Select skills to add', await skillDirectories(PACKAGE_SKILLS));
    if (selection.back) return false;
    names = selection.selected;
  }
  if (!names.length) return false;

  await fs.mkdir(PROJECT_SKILLS, { recursive: true });
  let changed = false;
  for (const name of names) {
    const src = path.join(PACKAGE_SKILLS, name);
    if (!(await exists(path.join(src, 'SKILL.md')))) { console.error(`✗ Unknown skill: ${name}`); continue; }
    const dest = path.join(PROJECT_SKILLS, name);
    if (await exists(dest)) {
      console.log(`• ${name} already installed; use update to replace it.`);
      continue;
    }
    await copyDir(src, dest);
    changed = true;
    console.log(`✓ Added ${name} → ./${dest}/`);
  }
  return changed;
}

async function remove(names) {
  const base = path.resolve(PROJECT_SKILLS);
  const installedNames = await skillDirectories(base);
  if (!names.length) {
    const selection = await interactiveSelect('Select skills to remove', installedNames);
    if (selection.back) return false;
    names = selection.selected;
  }
  let changed = false;
  for (const name of names) {
    const dest = path.join(base, name);
    if (!(await exists(dest))) { console.log(`• ${name} is not installed.`); continue; }
    await fs.rm(dest, { recursive: true, force: true });
    changed = true;
    console.log(`✓ Removed ${name}`);
  }
  return changed;
}

async function update(names) {
  const base = path.resolve(PROJECT_SKILLS);
  const installedNames = await skillDirectories(base);
  if (!names.length) {
    const selection = await interactiveSelect('Select skills to update', installedNames);
    if (selection.back) return false;
    names = selection.selected;
  }
  let changed = false;
  for (const name of names) {
    const src = path.join(PACKAGE_SKILLS, name);
    const dest = path.join(base, name);
    if (!(await exists(path.join(src, 'SKILL.md')))) { console.error(`✗ Skill is no longer in this package: ${name}`); continue; }
    if (!(await exists(dest))) { console.log(`• ${name} is not installed; use add ${name}.`); continue; }
    await fs.rm(dest, { recursive: true, force: true });
    await copyDir(src, dest);
    changed = true;
    console.log(`✓ Updated ${name}`);
  }
  return changed;
}

async function info(name) {
  if (!name) { usage(); return; }
  const i = await skillInfo(name);
  if (!i) { console.error(`Skill not found: ${name}`); process.exitCode = 1; return; }
  console.log(`\n${i.name}`);
  console.log(`  Description: ${i.description || '(none)'}`);
  console.log(`  Source: ${path.relative(process.cwd(), i.path) || '.'}`);
  console.log(`  Definition: ${path.relative(process.cwd(), path.join(i.path, 'SKILL.md'))}`);
  console.log();
}

async function search(term) {
  if (!term) { usage(); return; }
  const names = await skillDirectories(PACKAGE_SKILLS);
  const needle = term.toLowerCase();
  const hits = [];
  for (const n of names) {
    const i = await skillInfo(n);
    if (n.toLowerCase().includes(needle) || (i?.description || '').toLowerCase().includes(needle)) hits.push(i);
  }
  if (!hits.length) { console.log(`No skills matched: ${term}`); return; }
  console.log();
  hits.forEach(i => console.log(`${i.name}${i.description ? ` — ${i.description}` : ''}`));
  console.log();
}

async function exportSkill(name, zip = false) {
  if (!name) { usage(); return; }
  const src = path.join(PACKAGE_SKILLS, name);
  if (!(await exists(path.join(src, 'SKILL.md')))) { console.error(`Skill not found: ${name}`); process.exitCode = 1; return; }
  const out = path.resolve(`${name}.skill`);
  await fs.rm(out, { recursive: true, force: true });
  await copyDir(src, out);
  if (zip) {
    const zipPath = path.resolve(`${name}.skill.zip`);
    const r = spawnSync(process.platform === 'win32' ? 'powershell' : 'zip', process.platform === 'win32'
      ? ['-NoProfile', '-Command', `Compress-Archive -Path '${out}/*' -DestinationPath '${zipPath}' -Force`]
      : ['-r', zipPath, '.'], { cwd: out, stdio: 'inherit' });
    if (r.status !== 0) { process.exitCode = r.status ?? 1; return; }
    console.log(`✓ Exported ${zipPath}`);
  } else console.log(`✓ Exported ${out}/`);
}

async function doctor() {
  let ok = true;
  const pkg = await readJson(path.join(PACKAGE_ROOT, 'package.json'));
  console.log('\nvkd-skills doctor\n');
  const checks = [
    ['package name', pkg.name === '@vkdatta/skills', pkg.name],
    ['package version', /^\d+\.\d+\.\d+$/.test(pkg.version), pkg.version],
    ['skills directory', await exists(PACKAGE_SKILLS), PACKAGE_SKILLS],
    ['project directory', true, path.resolve(PROJECT_SKILLS)],
  ];
  for (const [label, pass, value] of checks) { console.log(`${pass ? '✓' : '✗'} ${label}: ${value}`); ok &&= pass; }
  if (!ok) process.exitCode = 1;
}

async function mainMenu() {
  while (true) {
    console.log(`\n@vkdatta/skills\n\n  1. Add skills\n  2. Remove skills\n  3. Update skills\n  4. List available skills\n  5. List installed skills\n  6. Search skills\n  7. Skill info\n  8. Export skill\n  9. Doctor\n  0. Exit\n`);
    const choice = await ask('Choose an option: ');

    if (choice === '0' || ['q', 'quit', 'exit'].includes(choice.toLowerCase())) return;

    switch (choice) {
      case '1': await add([]); break;
      case '2': await remove([]); break;
      case '3': await update([]); break;
      case '4': await listAvailable(); break;
      case '5': await installed(); break;
      case '6': {
        const term = await ask('Search term (0 = back): ');
        if (!isBack(term)) await search(term);
        break;
      }
      case '7': {
        const name = await ask('Skill name (0 = back): ');
        if (!isBack(name)) await info(name);
        break;
      }
      case '8': {
        const name = await ask('Skill name (0 = back): ');
        if (!isBack(name)) await exportSkill(name);
        break;
      }
      case '9': await doctor(); break;
      default:
        console.log('\nInvalid option. Choose 0-9.\n');
    }
  }
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command) {
    await mainMenu();
    return;
  }

  switch (command) {
    case 'list': return listAvailable();
    case 'add': return add(args);
    case 'remove': case 'rm': return remove(args);
    case 'update': return update(args);
    case 'installed': return installed();
    case 'info': return info(args[0]);
    case 'search': return search(args.join(' '));
    case 'path': console.log(path.resolve(PROJECT_SKILLS)); return;
    case 'doctor': return doctor();
    case 'export': return exportSkill(args[0], args.includes('--zip'));
    case 'version': console.log(await packageVersion()); return;
    case 'help': case '--help': case '-h': return usage();
    case '--version': case '-v': console.log(await packageVersion()); return;
    default:
      console.error(`Unknown command: ${command}`);
      usage();
      process.exitCode = 1;
  }
}

main().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
});
