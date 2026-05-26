'use strict';

const fs = require('fs');
const path = require('path');
const {
  resolveTargetPath,
  pathExists,
  isDirectory
} = require('./utils');
const templates = require('./templates');

function toReportPath(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function createFileIfMissing(targetPath, relativePath, content, result) {
  const filePath = path.join(targetPath, relativePath);
  const reportPath = toReportPath(relativePath);

  if (pathExists(filePath)) {
    result.skipped.push({
      path: reportPath,
      type: 'file',
      reason: 'already exists'
    });
    return false;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  result.created.push({
    path: reportPath,
    type: 'file'
  });
  return true;
}

function createDirectoryIfMissing(targetPath, relativePath, result) {
  const directoryPath = path.join(targetPath, relativePath);
  const reportPath = toReportPath(relativePath);

  if (pathExists(directoryPath)) {
    result.skipped.push({
      path: reportPath,
      type: 'directory',
      reason: 'already exists'
    });
    return false;
  }

  fs.mkdirSync(directoryPath);
  result.created.push({
    path: reportPath,
    type: 'directory'
  });
  return true;
}

function initializeProject(inputPath, options) {
  const opts = options || {};
  const targetPath = resolveTargetPath(inputPath, opts.cwd);

  if (!pathExists(targetPath)) {
    throw new Error(`Target path does not exist: ${targetPath}`);
  }

  if (!isDirectory(targetPath)) {
    throw new Error(`Target path is not a directory: ${targetPath}`);
  }

  const result = {
    targetPath,
    created: [],
    skipped: []
  };

  createFileIfMissing(targetPath, 'AGENTS.md', templates.agentsMd, result);
  createFileIfMissing(targetPath, '.env.example', templates.envExample, result);
  createFileIfMissing(targetPath, 'CONTRIBUTING.md', templates.contributingMd, result);

  if (createDirectoryIfMissing(targetPath, 'docs', result)) {
    createFileIfMissing(targetPath, path.join('docs', 'README.md'), templates.docsReadme, result);
  }

  if (createDirectoryIfMissing(targetPath, 'examples', result)) {
    createFileIfMissing(targetPath, path.join('examples', 'README.md'), templates.examplesReadme, result);
  }

  return result;
}

module.exports = {
  initializeProject
};
