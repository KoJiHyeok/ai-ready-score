'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { scanProject, isSensitiveFileName, matchesRootIgnorePattern } = require('../src/scanner');

function makeTempProject() {
  return mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-'));
}

function removeTempProject(projectPath) {
  rmSync(projectPath, { recursive: true, force: true });
}

test('scanner detects files and folders in the root project directory', () => {
  const projectPath = makeTempProject();

  try {
    mkdirSync(path.join(projectPath, 'src'));
    mkdirSync(path.join(projectPath, 'tests'));
    writeFileSync(path.join(projectPath, 'README.md'), '# Example\n', 'utf8');
    writeFileSync(path.join(projectPath, 'package.json'), '{"scripts":{"test":"node --test"}}', 'utf8');

    const scan = scanProject(projectPath);

    assert.equal(scan.targetPath, path.resolve(projectPath));
    assert.equal(scan.exists, true);
    assert.equal(scan.validTarget, true);
    assert.ok(scan.directories.includes('src'));
    assert.ok(scan.directories.includes('tests'));
    assert.ok(scan.files.includes('README.md'));
    assert.equal(scan.packageJson.data.scripts.test, 'node --test');
  } finally {
    removeTempProject(projectPath);
  }
});

test('scanner reports invalid package.json without throwing', () => {
  const projectPath = makeTempProject();

  try {
    writeFileSync(path.join(projectPath, 'package.json'), '{ nope', 'utf8');
    const scan = scanProject(projectPath);

    assert.equal(scan.packageJson.exists, true);
    assert.equal(scan.packageJson.data, null);
    assert.ok(scan.packageJson.error instanceof Error);
    assert.ok(scan.warnings.some((warning) => warning.includes('package.json')));
  } finally {
    removeTempProject(projectPath);
  }
});

test('scanner parses package.json with a UTF-8 BOM', () => {
  const projectPath = makeTempProject();

  try {
    writeFileSync(path.join(projectPath, 'package.json'), '\uFEFF{"scripts":{"test":"node --test"}}', 'utf8');
    const scan = scanProject(projectPath);

    assert.equal(scan.packageJson.exists, true);
    assert.equal(scan.packageJson.error, null);
    assert.equal(scan.packageJson.data.scripts.test, 'node --test');
  } finally {
    removeTempProject(projectPath);
  }
});

test('scanner detects configured sensitive root file names', () => {
  assert.equal(isSensitiveFileName('.env'), true);
  assert.equal(isSensitiveFileName('.env.local'), true);
  assert.equal(isSensitiveFileName('.env.production'), true);
  assert.equal(isSensitiveFileName('id_rsa'), true);
  assert.equal(isSensitiveFileName('id_dsa'), true);
  assert.equal(isSensitiveFileName('server.pem'), true);
  assert.equal(isSensitiveFileName('private.key'), true);
  assert.equal(isSensitiveFileName('README.md'), false);
});

test('scanner ignores matching root-level files and folders', () => {
  const projectPath = makeTempProject();

  try {
    mkdirSync(path.join(projectPath, 'docs'));
    writeFileSync(path.join(projectPath, 'README.md'), '# Ignored\n', 'utf8');
    writeFileSync(path.join(projectPath, 'package.json'), '{"scripts":{"test":"node --test"}}', 'utf8');

    const scan = scanProject(projectPath, {
      ignorePatterns: ['README.md', 'docs', 'package.json']
    });

    assert.equal(scan.rootFileContents['README.md'], '');
    assert.equal(scan.packageJson.exists, false);
    assert.equal(scan.files.includes('README.md'), false);
    assert.equal(scan.files.includes('package.json'), false);
    assert.equal(scan.directories.includes('docs'), false);
    assert.deepEqual(scan.ignored.sort((left, right) => left.path.localeCompare(right.path)), [
      { path: 'docs', type: 'directory', pattern: 'docs' },
      { path: 'package.json', type: 'file', pattern: 'package.json' },
      { path: 'README.md', type: 'file', pattern: 'README.md' }
    ]);
  } finally {
    removeTempProject(projectPath);
  }
});

test('scanner supports root-level wildcard ignore patterns', () => {
  assert.equal(matchesRootIgnorePattern('debug.log', '*.log'), true);
  assert.equal(matchesRootIgnorePattern('debug.txt', '*.log'), false);
  assert.equal(matchesRootIgnorePattern('dist', 'dist'), true);
  assert.equal(matchesRootIgnorePattern('src/dist', 'dist'), false);
});
