'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, readFileSync, rmSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const { parseArgs } = require('../src/cli');

const rootPath = path.resolve(__dirname, '..');
const cliPath = path.join(rootPath, 'bin', 'ai-ready-score.js');

function runCli(args, options) {
  return spawnSync(process.execPath, [cliPath].concat(args || []), {
    cwd: options && options.cwd ? options.cwd : rootPath,
    encoding: 'utf8'
  });
}

test('--help works', () => {
  const result = runCli(['--help']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /--json/);
});

test('--version works', () => {
  const result = runCli(['--version']);
  const packageJson = require('../package.json');

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), packageJson.version);
});

test('--json returns parseable JSON', () => {
  const result = runCli(['--json']);

  assert.equal(result.status, 0);
  const parsed = JSON.parse(result.stdout);

  assert.equal(parsed.maxScore, 100);
  assert.equal(typeof parsed.targetPath, 'string');
  assert.equal(typeof parsed.score, 'number');
  assert.ok(Array.isArray(parsed.checks));
  assert.ok(Array.isArray(parsed.recommendations));
  assert.ok(Array.isArray(parsed.warnings));
});

test('--output writes a JSON report', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-output-'));
  const outputPath = path.join(tempPath, 'report.json');

  try {
    const result = runCli(['--output', outputPath]);

    assert.equal(result.status, 0);
    assert.match(result.stdout, /Report written to/);

    const parsed = JSON.parse(readFileSync(outputPath, 'utf8'));
    assert.equal(parsed.maxScore, 100);
    assert.equal(typeof parsed.grade, 'string');
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('default command produces human-readable output', () => {
  const result = runCli([]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Target path:/);
  assert.match(result.stdout, /Total score:/);
  assert.match(result.stdout, /Category breakdown:/);
  assert.match(result.stdout, /Recommended next steps:/);
});

test('explicit target path is parsed separately from options', () => {
  const parsed = parseArgs(['./examples/good-project', '--json']);

  assert.equal(parsed.targetPath, './examples/good-project');
  assert.equal(parsed.json, true);
  assert.equal(parsed.errors.length, 0);
});

test('example projects can be scanned through the CLI', () => {
  const good = runCli(['./examples/good-project']);
  const poor = runCli(['./examples/poor-project']);

  assert.equal(good.status, 0);
  assert.match(good.stdout, /Grade: A/);
  assert.equal(poor.status, 0);
  assert.match(poor.stdout, /Total score:/);
});
