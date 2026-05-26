'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
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
  assert.match(result.stdout, /사용법:/);
  assert.match(result.stdout, /--init/);
  assert.match(result.stdout, /--min-score <0-100>/);
  assert.match(result.stdout, /--config <file>/);
  assert.match(result.stdout, /--ignore <pattern>/);
  assert.match(result.stdout, /--json/);
  assert.match(result.stdout, /--markdown/);
  assert.match(result.stdout, /--lang <ko\|en>/);
});

test('--help supports English', () => {
  const result = runCli(['--help', '--lang', 'en']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
  assert.match(result.stdout, /Set human-readable output language/);
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
  assert.equal(parsed.categories.documentation.name, 'Documentation');
  assert.ok(parsed.checks.some((check) => check.label === 'README.md exists'));
  assert.ok(Array.isArray(parsed.checks));
  assert.ok(Array.isArray(parsed.recommendations));
  assert.ok(Array.isArray(parsed.warnings));
});

test('--min-score passes when score is high enough', () => {
  const result = runCli(['.', '--min-score', '80', '--lang', 'en']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Score threshold: Passed score threshold: 100\/100 is at least 80\./);
});

test('--min-score exits with code 1 when score is too low', () => {
  const result = runCli(['./examples/poor-project', '--min-score', '80', '--lang', 'en']);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /Score threshold: Failed score threshold:/);
  assert.match(result.stdout, /is below 80\./);
});

test('invalid --min-score value fails with a friendly error', () => {
  const result = runCli(['.', '--lang', 'en', '--min-score', 'nope']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--min-score requires a number from 0 to 100/);
  assert.match(result.stderr, /Received: nope/);
});

test('--min-score below 0 fails with a friendly error', () => {
  const result = runCli(['.', '--lang', 'en', '--min-score', '-1']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--min-score requires a number from 0 to 100/);
  assert.match(result.stderr, /Received: -1/);
});

test('--min-score above 100 fails with a friendly error', () => {
  const result = runCli(['.', '--lang', 'en', '--min-score', '101']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--min-score requires a number from 0 to 100/);
  assert.match(result.stderr, /Received: 101/);
});

test('--min-score with --lang ko prints Korean threshold message', () => {
  const result = runCli(['.', '--min-score', '80', '--lang', 'ko']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /점수 기준: 점수 기준 통과: 100\/100점이 최소 80점 이상입니다\./);
});

test('--min-score with --lang en prints English threshold message', () => {
  const result = runCli(['.', '--min-score', '80', '--lang', 'en']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Score threshold: Passed score threshold: 100\/100 is at least 80\./);
});

test('--min-score with --json includes threshold data', () => {
  const result = runCli(['.', '--min-score', '80', '--json']);
  const parsed = JSON.parse(result.stdout);

  assert.equal(result.status, 0);
  assert.deepEqual(parsed.threshold, {
    minScore: 80,
    passed: true
  });
});

test('--min-score cannot be combined with --init', () => {
  const result = runCli(['--lang', 'en', '--init', '--min-score', '80']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--min-score cannot be used with --init/);
});

test('--config adds project-specific checks to JSON output', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-config-json-'));
  const configPath = path.join(tempPath, 'ai-ready-score.config.json');

  try {
    writeFileSync(path.join(tempPath, 'README.md'), '# Config fixture\n\nUsage\nInstallation\nProject structure\n', 'utf8');
    writeFileSync(path.join(tempPath, 'package.json'), '{"scripts":{"test":"node --test","lint":"node --check index.js"}}', 'utf8');
    writeFileSync(path.join(tempPath, 'SECURITY.md'), '# Security\n', 'utf8');
    mkdirSync(path.join(tempPath, 'docs'));
    writeFileSync(configPath, JSON.stringify({
      requiredFiles: ['SECURITY.md'],
      requiredDirectories: ['docs'],
      requiredPackageScripts: ['lint'],
      forbiddenFiles: ['.env']
    }), 'utf8');

    const result = runCli(['.', '--config', configPath, '--json'], { cwd: tempPath });
    const parsed = JSON.parse(result.stdout);

    assert.equal(result.status, 0);
    assert.equal(parsed.config.path, configPath);
    assert.equal(parsed.config.passed, true);
    assert.equal(parsed.config.checks.length, 4);
    assert.ok(parsed.config.checks.some((check) => check.type === 'requiredFile' && check.path === 'SECURITY.md' && check.passed));
    assert.ok(parsed.config.checks.some((check) => check.type === 'requiredPackageScript' && check.path === 'lint' && check.passed));
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--config can fail when configured requirements are missing', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-config-fail-'));
  const configPath = path.join(tempPath, 'ai-ready-score.config.json');

  try {
    writeFileSync(configPath, JSON.stringify({
      failOnMissingConfigRequirements: true,
      requiredFiles: ['SECURITY.md']
    }), 'utf8');

    const result = runCli(['.', '--config', configPath, '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 1);
    assert.match(result.stdout, /Config status: Failed configured checks/);
    assert.match(result.stdout, /\[fail\] Required file exists: SECURITY\.md/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--config is included in Markdown output', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-config-markdown-'));
  const configPath = path.join(tempPath, 'ai-ready-score.config.json');

  try {
    writeFileSync(configPath, JSON.stringify({
      requiredFiles: ['SECURITY.md']
    }), 'utf8');

    const result = runCli(['.', '--config', configPath, '--markdown', '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /## Configured checks/);
    assert.match(result.stdout, /fail: Required file exists: SECURITY\.md/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--config with --lang ko prints Korean config text', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-config-ko-'));
  const configPath = path.join(tempPath, 'ai-ready-score.config.json');

  try {
    writeFileSync(configPath, JSON.stringify({
      requiredFiles: ['SECURITY.md']
    }), 'utf8');

    const result = runCli(['.', '--config', configPath, '--lang', 'ko'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /설정 검사 상태/);
    assert.match(result.stdout, /필수 파일이 있습니다: SECURITY\.md/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--config minScore applies when --min-score is not provided', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-config-min-score-'));
  const configPath = path.join(tempPath, 'ai-ready-score.config.json');

  try {
    writeFileSync(configPath, JSON.stringify({ minScore: 80 }), 'utf8');

    const result = runCli(['.', '--config', configPath, '--json'], { cwd: tempPath });
    const parsed = JSON.parse(result.stdout);

    assert.equal(result.status, 1);
    assert.deepEqual(parsed.threshold, {
      minScore: 80,
      passed: false
    });
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--min-score overrides config minScore', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-config-min-score-override-'));
  const configPath = path.join(tempPath, 'ai-ready-score.config.json');

  try {
    writeFileSync(configPath, JSON.stringify({ minScore: 100 }), 'utf8');

    const result = runCli(['.', '--config', configPath, '--min-score', '0', '--json'], { cwd: tempPath });
    const parsed = JSON.parse(result.stdout);

    assert.equal(result.status, 0);
    assert.deepEqual(parsed.threshold, {
      minScore: 0,
      passed: true
    });
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('invalid --config JSON fails with a friendly error', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-config-invalid-'));
  const configPath = path.join(tempPath, 'ai-ready-score.config.json');

  try {
    writeFileSync(configPath, '{ nope', 'utf8');

    const result = runCli(['.', '--config', configPath, '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 1);
    assert.match(result.stderr, /ai-ready-score failed: Config file must contain valid JSON/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--config accepts UTF-8 BOM JSON files', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-config-bom-'));
  const configPath = path.join(tempPath, 'ai-ready-score.config.json');

  try {
    writeFileSync(configPath, `\uFEFF${JSON.stringify({ requiredFiles: ['README.md'] })}`, 'utf8');
    writeFileSync(path.join(tempPath, 'README.md'), '# BOM fixture\n', 'utf8');

    const result = runCli(['.', '--config', configPath, '--json'], { cwd: tempPath });
    const parsed = JSON.parse(result.stdout);

    assert.equal(result.status, 0);
    assert.equal(parsed.config.passed, true);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--config cannot be combined with --init', () => {
  const result = runCli(['--init', '--config', 'ai-ready-score.config.json', '--lang', 'en']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /--config cannot be used with --init/);
});

test('--ignore can be provided repeatedly', () => {
  const parsed = parseArgs(['.', '--ignore', 'node_modules', '--ignore=dist', '--json']);

  assert.equal(parsed.targetPath, '.');
  assert.equal(parsed.json, true);
  assert.deepEqual(parsed.ignore, ['node_modules', 'dist']);
  assert.equal(parsed.errors.length, 0);
});

test('invalid --ignore path fails with a friendly error', () => {
  const result = runCli(['.', '--ignore', 'dist/output', '--lang', 'en']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /must be root-level names or patterns/);
});

test('--ignore excludes matching root items from JSON scoring input', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-ignore-json-'));

  try {
    writeFileSync(path.join(tempPath, '.env'), 'SECRET=example\n', 'utf8');

    const result = runCli(['.', '--ignore', '.env', '--json'], { cwd: tempPath });
    const parsed = JSON.parse(result.stdout);

    assert.equal(result.status, 0);
    assert.deepEqual(parsed.ignorePatterns, ['.env']);
    assert.deepEqual(parsed.ignored, [
      { path: '.env', type: 'file', pattern: '.env' }
    ]);
    assert.equal(parsed.warnings.some((warning) => warning.includes('.env')), false);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--ignore supports repeated root-level patterns', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-ignore-repeat-'));

  try {
    mkdirSync(path.join(tempPath, 'dist'));
    mkdirSync(path.join(tempPath, 'node_modules'));

    const result = runCli(['.', '--ignore', 'node_modules', '--ignore', 'dist', '--json'], { cwd: tempPath });
    const parsed = JSON.parse(result.stdout);
    const ignoredPaths = parsed.ignored.map((item) => item.path).sort();

    assert.equal(result.status, 0);
    assert.deepEqual(parsed.ignorePatterns, ['node_modules', 'dist']);
    assert.deepEqual(ignoredPaths, ['dist', 'node_modules']);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--ignore supports root-level wildcard patterns', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-ignore-wildcard-'));

  try {
    writeFileSync(path.join(tempPath, 'private.key'), 'SECRET=example\n', 'utf8');

    const result = runCli(['.', '--ignore', '*.key', '--json'], { cwd: tempPath });
    const parsed = JSON.parse(result.stdout);

    assert.equal(result.status, 0);
    assert.deepEqual(parsed.ignorePatterns, ['*.key']);
    assert.deepEqual(parsed.ignored, [
      { path: 'private.key', type: 'file', pattern: '*.key' }
    ]);
    assert.equal(parsed.warnings.some((warning) => warning.includes('private.key')), false);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('config ignore array excludes matching root items', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-ignore-config-'));
  const configPath = path.join(tempPath, 'ai-ready-score.config.json');

  try {
    writeFileSync(path.join(tempPath, '.env'), 'SECRET=example\n', 'utf8');
    writeFileSync(configPath, JSON.stringify({ ignore: ['.env'] }), 'utf8');

    const result = runCli(['.', '--config', configPath, '--json'], { cwd: tempPath });
    const parsed = JSON.parse(result.stdout);

    assert.equal(result.status, 0);
    assert.deepEqual(parsed.config.ignore, ['.env']);
    assert.deepEqual(parsed.ignorePatterns, ['.env']);
    assert.deepEqual(parsed.ignored, [
      { path: '.env', type: 'file', pattern: '.env' }
    ]);
    assert.equal(parsed.warnings.some((warning) => warning.includes('.env')), false);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--ignore is shown in English text output', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-ignore-text-'));

  try {
    writeFileSync(path.join(tempPath, '.env'), 'SECRET=example\n', 'utf8');

    const result = runCli(['.', '--ignore', '.env', '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /Ignored root items:/);
    assert.match(result.stdout, /Ignore patterns: \.env/);
    assert.match(result.stdout, /\.env \(file, matched \.env\)/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--ignore is shown in English Markdown output', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-ignore-markdown-'));

  try {
    writeFileSync(path.join(tempPath, '.env'), 'SECRET=example\n', 'utf8');

    const result = runCli(['.', '--ignore', '.env', '--markdown', '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /## Ignored root items/);
    assert.match(result.stdout, /\*\*Ignore patterns:\*\* \.env/);
    assert.match(result.stdout, /\.env \(file, matched \.env\)/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--init creates missing starter files in the current directory', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-init-'));

  try {
    const result = runCli(['--init', '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /AI-ready initialization is complete\./);
    assert.match(result.stdout, /Created items:/);
    assert.ok(existsSync(path.join(tempPath, 'AGENTS.md')));
    assert.ok(existsSync(path.join(tempPath, '.env.example')));
    assert.ok(existsSync(path.join(tempPath, 'CONTRIBUTING.md')));
    assert.ok(existsSync(path.join(tempPath, 'docs')));
    assert.ok(existsSync(path.join(tempPath, 'docs', 'README.md')));
    assert.ok(existsSync(path.join(tempPath, 'examples')));
    assert.ok(existsSync(path.join(tempPath, 'examples', 'README.md')));
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--init works with an explicit target path', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-init-target-'));
  const targetPath = path.join(tempPath, 'project');

  try {
    mkdirSync(targetPath);

    const result = runCli([targetPath, '--init', '--lang', 'en']);

    assert.equal(result.status, 0);
    assert.ok(existsSync(path.join(targetPath, 'AGENTS.md')));
    assert.ok(existsSync(path.join(targetPath, 'docs', 'README.md')));
    assert.ok(result.stdout.includes(targetPath));
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--init does not overwrite existing files', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-init-existing-'));
  const agentsPath = path.join(tempPath, 'AGENTS.md');

  try {
    writeFileSync(agentsPath, 'existing instructions\n', 'utf8');

    const result = runCli(['--init', '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.equal(readFileSync(agentsPath, 'utf8'), 'existing instructions\n');
    assert.match(result.stdout, /AGENTS\.md already exists/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--init reports skipped files and folders when nothing is created', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-init-skip-'));

  try {
    writeFileSync(path.join(tempPath, 'AGENTS.md'), 'existing\n', 'utf8');
    writeFileSync(path.join(tempPath, '.env.example'), 'EXAMPLE=true\n', 'utf8');
    writeFileSync(path.join(tempPath, 'CONTRIBUTING.md'), 'existing\n', 'utf8');
    mkdirSync(path.join(tempPath, 'docs'));
    mkdirSync(path.join(tempPath, 'examples'));

    const result = runCli(['--init', '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /Nothing to create\. The basic structure is already present\./);
    assert.match(result.stdout, /Skipped items:/);
    assert.match(result.stdout, /AGENTS\.md already exists/);
    assert.match(result.stdout, /docs already exists/);
    assert.match(result.stdout, /examples already exists/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--init --lang ko outputs Korean text', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-init-ko-'));

  try {
    const result = runCli(['--init', '--lang', 'ko'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /AI-ready 초기화가 완료되었습니다\./);
    assert.match(result.stdout, /생성된 항목:/);
    assert.match(result.stdout, /건너뛴 항목:/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--init --lang en outputs English text', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-init-en-'));

  try {
    const result = runCli(['--init', '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /AI-ready initialization is complete\./);
    assert.match(result.stdout, /Created items:/);
    assert.match(result.stdout, /Skipped items:/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--init --json returns parseable JSON', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-init-json-'));

  try {
    const result = runCli(['--init', '--json'], { cwd: tempPath });
    const parsed = JSON.parse(result.stdout);

    assert.equal(result.status, 0);
    assert.equal(parsed.targetPath, tempPath);
    assert.ok(parsed.created.some((item) => item.path === 'AGENTS.md' && item.type === 'file'));
    assert.ok(parsed.created.some((item) => item.path === 'docs/README.md' && item.type === 'file'));
    assert.deepEqual(parsed.skipped, []);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--init --markdown returns a Markdown initialization report', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-init-markdown-'));

  try {
    const result = runCli(['--init', '--markdown', '--lang', 'en'], { cwd: tempPath });

    assert.equal(result.status, 0);
    assert.match(result.stdout, /^# AI-Ready Initialization Report/m);
    assert.match(result.stdout, /## Created items/);
    assert.match(result.stdout, /- AGENTS\.md/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--init --json --output writes an initialization JSON report', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-init-output-'));
  const targetPath = path.join(tempPath, 'project');
  const outputPath = path.join(tempPath, 'init-report.json');

  try {
    mkdirSync(targetPath);

    const result = runCli([targetPath, '--init', '--json', '--output', outputPath]);

    assert.equal(result.status, 0);
    assert.match(result.stdout, /Report written to/);

    const parsed = JSON.parse(readFileSync(outputPath, 'utf8'));
    assert.equal(parsed.targetPath, targetPath);
    assert.ok(parsed.created.some((item) => item.path === 'CONTRIBUTING.md'));
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
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
  assert.match(result.stdout, /대상 경로:/);
  assert.match(result.stdout, /총점:/);
  assert.match(result.stdout, /카테고리별 점수:/);
  assert.match(result.stdout, /추천 다음 단계:/);
  assert.match(result.stdout, /문서화:/);
});

test('--lang ko produces Korean human-readable output', () => {
  const result = runCli(['.', '--lang', 'ko']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /대상 경로:/);
  assert.match(result.stdout, /\[통과\]/);
  assert.match(result.stdout, /README\.md가 있습니다\./);
});

test('--lang en produces English human-readable output', () => {
  const result = runCli(['.', '--lang', 'en']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Target path:/);
  assert.match(result.stdout, /Total score:/);
  assert.match(result.stdout, /Category breakdown:/);
  assert.match(result.stdout, /\[pass\] README\.md exists/);
});

test('unsupported --lang returns a friendly error', () => {
  const result = runCli(['.', '--lang', 'ja']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /지원하지 않는 언어입니다: ja/);
  assert.match(result.stderr, /--lang ko 또는 --lang en/);
});

test('--markdown produces Korean Markdown output by default', () => {
  const result = runCli(['.', '--markdown']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /^# AI 준비도 분석 리포트/m);
  assert.match(result.stdout, /\*\*검사 대상:\*\*/);
  assert.match(result.stdout, /## 카테고리별 점수/);
  assert.match(result.stdout, /\| 문서화 \| 25\/25 \|/);
});

test('--markdown --lang ko produces Korean Markdown output', () => {
  const result = runCli(['.', '--markdown', '--lang', 'ko']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /^# AI 준비도 분석 리포트/m);
  assert.match(result.stdout, /## 통과한 항목/);
  assert.match(result.stdout, /README\.md가 있습니다\./);
});

test('--markdown --lang en produces English Markdown output', () => {
  const result = runCli(['.', '--markdown', '--lang', 'en']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /^# AI-Ready Codebase Report/m);
  assert.match(result.stdout, /\*\*Target:\*\*/);
  assert.match(result.stdout, /## Category Breakdown/);
  assert.match(result.stdout, /\| Documentation \| 25\/25 \|/);
});

test('--markdown --output writes a Markdown report', () => {
  const tempPath = mkdtempSync(path.join(os.tmpdir(), 'ai-ready-score-markdown-'));
  const outputPath = path.join(tempPath, 'report.md');

  try {
    const result = runCli(['.', '--markdown', '--output', outputPath]);

    assert.equal(result.status, 0);
    assert.match(result.stdout, /Report written to/);

    const markdown = readFileSync(outputPath, 'utf8');
    assert.match(markdown, /^# AI 준비도 분석 리포트/m);
    assert.match(markdown, /## 추천 작업/);
  } finally {
    rmSync(tempPath, { recursive: true, force: true });
  }
});

test('--json and --markdown cannot be combined', () => {
  const result = runCli(['.', '--json', '--markdown']);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /출력 형식은 하나만 선택할 수 있습니다/);
  assert.match(result.stderr, /--json 또는 --markdown/);
});

test('explicit target path is parsed separately from options', () => {
  const parsed = parseArgs(['./examples/good-project', '--json', '--lang', 'en']);

  assert.equal(parsed.targetPath, './examples/good-project');
  assert.equal(parsed.json, true);
  assert.equal(parsed.lang, 'en');
  assert.equal(parsed.errors.length, 0);
});

test('--init is parsed separately from target path and options', () => {
  const parsed = parseArgs(['./examples/good-project', '--init', '--lang', 'en']);

  assert.equal(parsed.targetPath, './examples/good-project');
  assert.equal(parsed.init, true);
  assert.equal(parsed.lang, 'en');
  assert.equal(parsed.errors.length, 0);
});

test('example projects can be scanned through the CLI', () => {
  const good = runCli(['./examples/good-project']);
  const poor = runCli(['./examples/poor-project']);

  assert.equal(good.status, 0);
  assert.match(good.stdout, /등급: A/);
  assert.equal(poor.status, 0);
  assert.match(poor.stdout, /총점:/);
});
