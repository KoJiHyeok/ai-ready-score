'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  getMessages,
  isSupportedLanguage,
  normalizeLanguage
} = require('../src/i18n');

// The reporter relies on `ko` and `en` exposing the same message keys so it can
// use `messages.report` directly instead of detecting the language. These tests
// guard that symmetry: a key added to one language must be added to the other.

const NAMESPACES = [
  'report',
  'init',
  'markdown',
  'help',
  'categories',
  'checks',
  'recommendations'
];

test('every message namespace exists in both languages', () => {
  const ko = getMessages('ko');
  const en = getMessages('en');

  NAMESPACES.forEach((namespace) => {
    assert.ok(ko[namespace], `ko is missing namespace: ${namespace}`);
    assert.ok(en[namespace], `en is missing namespace: ${namespace}`);
  });
});

test('ko and en share identical keys within each namespace', () => {
  const ko = getMessages('ko');
  const en = getMessages('en');

  NAMESPACES.forEach((namespace) => {
    const koKeys = Object.keys(ko[namespace]).sort();
    const enKeys = Object.keys(en[namespace]).sort();

    assert.deepEqual(
      koKeys,
      enKeys,
      `key mismatch in "${namespace}": ko=[${koKeys}] en=[${enKeys}]`
    );
  });
});

test('config and ignore help entries exist in both languages', () => {
  // The cli help text uses messages.config / messages.ignore directly (the
  // fallback strings were removed during refactoring), so both must be present.
  ['ko', 'en'].forEach((language) => {
    const help = getMessages(language).help;
    assert.equal(typeof help.config, 'string');
    assert.ok(help.config.length > 0);
    assert.equal(typeof help.ignore, 'string');
    assert.ok(help.ignore.length > 0);
  });
});

test('every message value is a non-empty string in both languages', () => {
  ['ko', 'en'].forEach((language) => {
    const bundle = getMessages(language);
    NAMESPACES.forEach((namespace) => {
      Object.entries(bundle[namespace]).forEach(([key, value]) => {
        assert.equal(typeof value, 'string', `${language}.${namespace}.${key} is not a string`);
        assert.ok(value.length > 0, `${language}.${namespace}.${key} is empty`);
      });
    });
  });
});

test('getMessages falls back to the default language for unknown input', () => {
  assert.equal(getMessages('fr'), getMessages(DEFAULT_LANGUAGE));
  assert.equal(getMessages(undefined), getMessages(DEFAULT_LANGUAGE));
});

test('language normalization is case-insensitive', () => {
  assert.equal(normalizeLanguage('EN'), 'en');
  assert.equal(isSupportedLanguage('KO'), true);
  assert.equal(isSupportedLanguage('de'), false);
  assert.deepEqual(SUPPORTED_LANGUAGES, ['ko', 'en']);
});
