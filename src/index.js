'use strict';

const { runCli } = require('./cli');
const { initializeProject } = require('./initializer');
const { scanProject } = require('./scanner');
const { scoreProject, getGrade } = require('./scorer');
const {
  formatTextReport,
  formatMarkdownReport,
  formatJsonReport,
  formatInitTextReport,
  formatInitMarkdownReport,
  formatInitJsonReport
} = require('./reporter');
const { rules, categories } = require('./rules');
const { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } = require('./i18n');

module.exports = {
  runCli,
  initializeProject,
  scanProject,
  scoreProject,
  getGrade,
  formatTextReport,
  formatMarkdownReport,
  formatJsonReport,
  formatInitTextReport,
  formatInitMarkdownReport,
  formatInitJsonReport,
  rules,
  categories,
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES
};
