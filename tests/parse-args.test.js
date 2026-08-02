'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseArgs } = require('../src/cli');

// These tests exercise the shared option-reading helper that backs --min-score,
// --config, --ignore, --lang, and --output. The `--opt value` and `--opt=value`
// forms must be treated identically for every option that accepts a value.

test('--config accepts the separate and inline forms identically', () => {
  const separate = parseArgs(['.', '--config', 'cfg.json']);
  const inline = parseArgs(['.', '--config=cfg.json']);

  assert.equal(separate.config, 'cfg.json');
  assert.equal(inline.config, separate.config);
  assert.equal(separate.errors.length, 0);
  assert.equal(inline.errors.length, 0);
});

test('--lang accepts the separate and inline forms identically', () => {
  const separate = parseArgs(['.', '--lang', 'en']);
  const inline = parseArgs(['.', '--lang=en']);

  assert.equal(separate.lang, 'en');
  assert.equal(inline.lang, separate.lang);
  assert.equal(separate.errors.length, 0);
  assert.equal(inline.errors.length, 0);
});

test('--output reads its value from the following argument', () => {
  const separate = parseArgs(['.', '--output', 'report.json']);
  const shortFlag = parseArgs(['.', '-o', 'report.json']);

  assert.equal(separate.output, 'report.json');
  assert.equal(shortFlag.output, 'report.json');
  assert.equal(separate.errors.length, 0);
  assert.equal(shortFlag.errors.length, 0);
});

test('--output does not support the inline --output=value form', () => {
  // Unlike --config/--lang/--ignore/--min-score, --output is matched only as an
  // exact flag (or -o), so the inline form is reported as an unknown option.
  const parsed = parseArgs(['.', '--output=report.json']);

  assert.equal(parsed.output, null);
  assert.equal(parsed.errors.length, 1);
  assert.match(parsed.errors[0], /Unknown option: --output=report\.json/);
});

test('--min-score accepts the separate and inline forms identically', () => {
  const separate = parseArgs(['.', '--min-score', '80']);
  const inline = parseArgs(['.', '--min-score=80']);

  assert.equal(separate.minScore, 80);
  assert.equal(inline.minScore, separate.minScore);
  assert.equal(separate.errors.length, 0);
  assert.equal(inline.errors.length, 0);
});

test('--ignore accepts the separate and inline forms identically', () => {
  const separate = parseArgs(['.', '--ignore', 'dist']);
  const inline = parseArgs(['.', '--ignore=dist']);

  assert.deepEqual(separate.ignore, ['dist']);
  assert.deepEqual(inline.ignore, separate.ignore);
  assert.equal(separate.errors.length, 0);
  assert.equal(inline.errors.length, 0);
});

test('a value-taking option does not swallow a following option flag', () => {
  // `--config` with no value followed by `--json` must report a missing value
  // rather than consuming `--json` as the config path.
  const parsed = parseArgs(['.', '--config', '--json']);

  assert.equal(parsed.config, null);
  assert.equal(parsed.json, true);
  assert.equal(parsed.errors.length, 1);
  assert.match(parsed.errors[0], /--config requires a file path/);
});

test('the inline form preserves a value that begins with --', () => {
  // Unlike the separate form, `--config=--weird` keeps the literal value.
  const parsed = parseArgs(['.', '--config=--weird']);

  assert.equal(parsed.config, '--weird');
  assert.equal(parsed.errors.length, 0);
});

test('an inline option with an empty value is treated as missing', () => {
  const parsed = parseArgs(['.', '--config=']);

  assert.equal(parsed.config, null);
  assert.equal(parsed.errors.length, 1);
  assert.match(parsed.errors[0], /--config requires a file path/);
});

test('min-score boundaries 0 and 100 are accepted, just-outside values are rejected', () => {
  assert.equal(parseArgs(['.', '--min-score', '0']).minScore, 0);
  assert.equal(parseArgs(['.', '--min-score', '100']).minScore, 100);

  const negative = parseArgs(['.', '--min-score', '-1']);
  const tooHigh = parseArgs(['.', '--min-score', '101']);
  const notANumber = parseArgs(['.', '--min-score', 'abc']);

  assert.equal(negative.minScore, null);
  assert.equal(negative.errors.length, 1);
  assert.equal(tooHigh.minScore, null);
  assert.equal(tooHigh.errors.length, 1);
  assert.equal(notANumber.minScore, null);
  assert.equal(notANumber.errors.length, 1);
});
