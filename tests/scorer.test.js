'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { scanProject } = require('../src/scanner');
const { getGrade, scoreProject } = require('../src/scorer');

function makeTempProject() {
  return mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-'));
}

function removeTempProject(projectPath) {
  rmSync(projectPath, { recursive: true, force: true });
}

test('grade calculation follows the rubric', () => {
  assert.equal(getGrade(100), 'A');
  assert.equal(getGrade(90), 'A');
  assert.equal(getGrade(89), 'B');
  assert.equal(getGrade(80), 'B');
  assert.equal(getGrade(79), 'C');
  assert.equal(getGrade(70), 'C');
  assert.equal(getGrade(69), 'D');
  assert.equal(getGrade(60), 'D');
  assert.equal(getGrade(59), 'F');
  assert.equal(getGrade(0), 'F');
});

test('score stays within 0-100', () => {
  const projectPath = makeTempProject();

  try {
    const result = scoreProject(scanProject(projectPath));
    assert.equal(result.maxScore, 100);
    assert.ok(result.score >= 0);
    assert.ok(result.score <= 100);
  } finally {
    removeTempProject(projectPath);
  }
});

test('invalid package.json does not crash scoring', () => {
  const projectPath = makeTempProject();

  try {
    writeFileSync(path.join(projectPath, 'package.json'), '{ invalid json', 'utf8');
    const result = scoreProject(scanProject(projectPath));

    assert.equal(result.checks.find((check) => check.id === 'package-json-exists').passed, true);
    assert.equal(result.checks.find((check) => check.id === 'script-test-exists').passed, false);
    assert.ok(result.warnings.some((warning) => warning.includes('package.json')));
  } finally {
    removeTempProject(projectPath);
  }
});

test('examples/good-project can be scanned and receives an A grade', () => {
  const projectPath = path.join(__dirname, '..', 'examples', 'good-project');
  const result = scoreProject(scanProject(projectPath));

  assert.equal(result.grade, 'A');
  assert.equal(result.score, 100);
  assert.equal(result.warnings.length, 0);
});

test('examples/poor-project can be scanned', () => {
  const projectPath = path.join(__dirname, '..', 'examples', 'poor-project');
  const result = scoreProject(scanProject(projectPath));

  assert.equal(result.targetPath, path.resolve(projectPath));
  assert.ok(result.score >= 0);
  assert.ok(result.score < 100);
});

test('sensitive root files remove safety points and add warnings', () => {
  const projectPath = makeTempProject();

  try {
    writeFileSync(path.join(projectPath, '.env'), 'SECRET=value', 'utf8');
    const result = scoreProject(scanProject(projectPath));
    const sensitiveCheck = result.checks.find((check) => check.id === 'no-sensitive-root-files');

    assert.equal(sensitiveCheck.passed, false);
    assert.ok(result.warnings.some((warning) => warning.includes('.env')));
  } finally {
    removeTempProject(projectPath);
  }
});

// Helper: returns the readme-usage check result for a crafted README.
function scoreReadme(readmeContent) {
  const projectPath = makeTempProject();

  try {
    writeFileSync(path.join(projectPath, 'README.md'), readmeContent, 'utf8');
    const result = scoreProject(scanProject(projectPath));
    return result.checks.find((check) => check.id === 'readme-usage');
  } finally {
    removeTempProject(projectPath);
  }
}

test('readme-usage rejects a gamed README that only mentions the word usage', () => {
  // Keyword appears in prose, but there is no usage section and no runnable
  // command. A keyword-only check passes this; the structural check must reject it.
  const gamed = [
    '# My Project',
    '',
    'This tool is easy to use. See the usage notes in our wiki for how to run it.',
    'Installation and usage details live elsewhere.'
  ].join('\n');

  assert.equal(scoreReadme(gamed).passed, false);
});

test('readme-usage accepts a real usage section with a runnable command', () => {
  const real = [
    '# My Project',
    '',
    '## Usage',
    '',
    '```sh',
    'npx my-project .',
    '```'
  ].join('\n');

  assert.equal(scoreReadme(real).passed, true);
});
