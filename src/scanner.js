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

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isSensitiveFileName(fileName) {
  const lowerName = fileName.toLowerCase();
  return SENSITIVE_FILE_NAMES.has(fileName) || lowerName.endsWith('.pem') || lowerName.endsWith('.key');
}

function matchesRootIgnorePattern(name, pattern) {
  if (pattern === name) {
    return true;
  }

  if (!pattern.includes('*')) {
    return false;
  }

  const expression = `^${pattern.split('*').map(escapeRegExp).join('.*')}$`;
  return new RegExp(expression).test(name);
}

function getMatchingIgnorePattern(name, ignorePatterns) {
  return ignorePatterns.find((pattern) => matchesRootIgnorePattern(name, pattern)) || null;
}

function scanProject(inputPath, options) {
  const opts = options || {};
  const ignorePatterns = Array.isArray(opts.ignorePatterns) ? opts.ignorePatterns : [];
  const targetPath = resolveTargetPath(inputPath, opts.cwd);
  const exists = pathExists(targetPath);
  const validTarget = exists && isDirectory(targetPath);
  const entries = validTarget ? listRootEntries(targetPath) : [];
  const files = [];
  const directories = [];
  const ignored = [];

  entries.forEach((entry) => {
    const ignoredBy = getMatchingIgnorePattern(entry.name, ignorePatterns);
    const entryType = entry.isDirectory() ? 'directory' : 'file';

    if (ignoredBy) {
      ignored.push({
        path: entry.name,
        type: entryType,
        pattern: ignoredBy
      });
      return;
    }

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
    rootFileContents[fileName] = getMatchingIgnorePattern(fileName, ignorePatterns) ? '' : isFile(filePath) ? readTextFile(filePath) : '';
  });

  const packageJsonPath = path.join(targetPath, 'package.json');
  const packageJson = getMatchingIgnorePattern('package.json', ignorePatterns)
    ? {
        exists: false,
        data: null,
        error: null
      }
    : readJsonFile(packageJsonPath);
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
    ignored,
    ignorePatterns: ignorePatterns.slice(),
    rootFileContents,
    packageJson,
    sensitiveFiles,
    warnings
  };
}

module.exports = {
  scanProject,
  isSensitiveFileName,
  matchesRootIgnorePattern
};
