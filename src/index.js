'use strict';

const { runCli } = require('./cli');
const { scanProject } = require('./scanner');
const { scoreProject, getGrade } = require('./scorer');
const { formatTextReport, formatJsonReport } = require('./reporter');
const { rules, categories } = require('./rules');
const { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } = require('./i18n');

module.exports = {
  runCli,
  scanProject,
  scoreProject,
  getGrade,
  formatTextReport,
  formatJsonReport,
  rules,
  categories,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES
};
