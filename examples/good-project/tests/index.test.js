'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { main } = require('../src/index');

test('main returns a value', () => {
  assert.equal(main(), 'good project');
});
