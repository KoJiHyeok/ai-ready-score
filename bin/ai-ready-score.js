#!/usr/bin/env node

'use strict';

const { runCli } = require('../src/cli');

runCli(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: process.stdout,
  stderr: process.stderr,
  exit: process.exit
});
