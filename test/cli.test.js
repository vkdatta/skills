import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cli = new URL('../bin/vkd-skills.js', import.meta.url);
const cliPath = cli.pathname;

function run(args, options = {}) {
  return execFileSync(process.execPath, [cliPath, ...args], {
    encoding: 'utf8',
    ...options,
  });
}

test('list exposes canvas', () => {
  const out = run(['list']);
  assert.match(out, /canvas/);
});

test('version is valid semver', () => {
  const out = run(['version']).trim();
  assert.match(out, /^\d+\.\d+\.\d+$/);
});

test('interactive selector documents checkbox controls', () => {
  const source = fs.readFileSync(cliPath, 'utf8');
  assert.match(source, /Space Select\/Unselect/);
  assert.match(source, /0\/Esc Back/);
  assert.match(source, /setRawMode\(true\)/);
  assert.match(source, /name === 'space'/);
});

test('non-TTY add supports 0 as back without creating project skills', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'vkd-skills-'));
  const out = run(['add'], {
    cwd,
    input: '0\n',
    timeout: 5000,
  });
  assert.match(out, /Select skills to add/);
  assert.match(out, /0\. Back to main menu/);
  assert.doesNotMatch(out, /readline was closed|Error:/);
  assert.equal(fs.existsSync(path.join(cwd, 'skills')), false);
  fs.rmSync(cwd, { recursive: true, force: true });
});
