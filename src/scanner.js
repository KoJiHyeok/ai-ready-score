'use strict';

const path = require('path');
const {
  resolveTargetPath,
  pathExists,
  isDirectory,
  isFile,
  readTextFile,
  readJsonFile,
  listRootEntries
} = require('./utils');

const SENSITIVE_FILE_NAMES = new Set([
  '.env',
  '.env.local',
  '.env.production',
  'id_rsa',
  'id_dsa'
]);

function isSensitiveFileName(fileName) {
  const lowerName = fileName.toLowerCase();
  return SENSITIVE_FILE_NAMES.has(fileName) || lowerName.endsWith('.pem') || lowerName.endsWith('.key');
}

function scanProject(inputPath, options) {
  const opts = options || {};
  const targetPath = resolveTargetPath(inputPath, opts.cwd);
  const exists = pathExists(targetPath);
  const validTarget = exists && isDirectory(targetPath);
  const entries = validTarget ? listRootEntries(targetPath) : [];
  const files = [];
  const directories = [];

  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      directories.push(entry.name);
      return;
    }

    if (entry.isFile()) {
      files.push(entry.name);
    }
  });

  const rootFileContents = {};
  ['README.md', 'AGENTS.md'].forEach((fileName) => {
    const filePath = path.join(targetPath, fileName);
    rootFileContents[fileName] = isFile(filePath) ? readTextFile(filePath) : '';
  });

  const packageJsonPath = path.join(targetPath, 'package.json');
  const packageJson = readJsonFile(packageJsonPath);
  const sensitiveFiles = files.filter(isSensitiveFileName);
  const warnings = [];

  if (!exists) {
    warnings.push(`Target path does not exist: ${targetPath}`);
  } else if (!validTarget) {
    warnings.push(`Target path is not a directory: ${targetPath}`);
  }

  if (packageJson.error) {
    warnings.push('package.json exists but could not be parsed.');
  }

  sensitiveFiles.forEach((fileName) => {
    warnings.push(`Sensitive file found in project root: ${fileName}`);
  });

  return {
    targetPath,
    exists,
    validTarget,
    files,
    directories,
    rootFileContents,
    packageJson,
    sensitiveFiles,
    warnings
  };
}

module.exports = {
  scanProject,
  isSensitiveFileName
};
