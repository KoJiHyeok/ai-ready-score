'use strict';

const fs = require('fs');
const path = require('path');

function resolveTargetPath(inputPath, cwd) {
  const basePath = cwd || process.cwd();
  return path.resolve(basePath, inputPath || '.');
}

function pathExists(targetPath) {
  try {
    fs.accessSync(targetPath);
    return true;
  } catch (error) {
    return false;
  }
}

function isDirectory(targetPath) {
  try {
    return fs.statSync(targetPath).isDirectory();
  } catch (error) {
    return false;
  }
}

function isFile(targetPath) {
  try {
    return fs.statSync(targetPath).isFile();
  } catch (error) {
    return false;
  }
}

function readTextFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return '';
  }
}

function readJsonFile(filePath) {
  const raw = readTextFile(filePath);

  if (!raw) {
    return {
      exists: pathExists(filePath),
      data: null,
      error: null
    };
  }

  try {
    return {
      exists: true,
      data: JSON.parse(raw.replace(/^\uFEFF/, '')),
      error: null
    };
  } catch (error) {
    return {
      exists: true,
      data: null,
      error
    };
  }
}

function listRootEntries(targetPath) {
  try {
    return fs.readdirSync(targetPath, { withFileTypes: true });
  } catch (error) {
    return [];
  }
}

function normalizeForSearch(text) {
  return String(text || '').toLowerCase();
}

function hasAnyKeyword(text, keywords) {
  const normalized = normalizeForSearch(text);
  return keywords.some((keyword) => normalized.includes(keyword));
}

module.exports = {
  resolveTargetPath,
  pathExists,
  isDirectory,
  isFile,
  readTextFile,
  readJsonFile,
  listRootEntries,
  normalizeForSearch,
  hasAnyKeyword
};
