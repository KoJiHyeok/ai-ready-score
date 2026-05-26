'use strict';

const fs = require('fs');
const path = require('path');
const { isDirectory, isFile, pathExists } = require('./utils');

function uniqueStrings(values) {
  const seen = new Set();
  const unique = [];

  values.forEach((value) => {
    if (!seen.has(value)) {
      seen.add(value);
      unique.push(value);
    }
  });

  return unique;
}

function normalizeRelativePath(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} must contain non-empty strings.`);
  }

  const trimmed = value.trim();

  if (path.isAbsolute(trimmed)) {
    throw new Error(`${fieldName} entries must be relative paths: ${trimmed}`);
  }

  const parts = trimmed.split(/[\\/]+/).filter(Boolean);

  if (parts.length === 0 || parts.includes('..')) {
    throw new Error(`${fieldName} entries must stay inside the target project: ${trimmed}`);
  }

  return parts.join('/');
}

function normalizeIgnorePattern(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} must contain non-empty strings.`);
  }

  const trimmed = value.trim();

  if (path.isAbsolute(trimmed) || trimmed.includes('/') || trimmed.includes('\\') || trimmed === '..' || trimmed.includes('..')) {
    throw new Error(`${fieldName} entries must be root-level names or patterns: ${trimmed}`);
  }

  return trimmed;
}

function normalizeIgnorePatterns(values, fieldName) {
  if (!Array.isArray(values)) {
    throw new Error(`${fieldName} must be an array.`);
  }

  return values.map((value) => normalizeIgnorePattern(value, fieldName));
}

function normalizeStringArray(config, fieldName, normalizer) {
  const value = config[fieldName];

  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array.`);
  }

  return value.map((item) => normalizer(item, fieldName));
}

function normalizeScriptName(value, fieldName) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} must contain non-empty strings.`);
  }

  return value.trim();
}

function normalizeMinScore(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error('minScore must be a number from 0 to 100.');
  }

  return value;
}

function normalizeConfig(rawConfig, configPath) {
  if (!rawConfig || typeof rawConfig !== 'object' || Array.isArray(rawConfig)) {
    throw new Error('config must be a JSON object.');
  }

  if (
    rawConfig.failOnMissingConfigRequirements !== undefined &&
    typeof rawConfig.failOnMissingConfigRequirements !== 'boolean'
  ) {
    throw new Error('failOnMissingConfigRequirements must be true or false.');
  }

  return {
    path: configPath,
    minScore: normalizeMinScore(rawConfig.minScore),
    failOnMissingConfigRequirements: Boolean(rawConfig.failOnMissingConfigRequirements),
    requiredFiles: normalizeStringArray(rawConfig, 'requiredFiles', normalizeRelativePath),
    requiredDirectories: normalizeStringArray(rawConfig, 'requiredDirectories', normalizeRelativePath),
    requiredPackageScripts: normalizeStringArray(rawConfig, 'requiredPackageScripts', normalizeScriptName),
    forbiddenFiles: normalizeStringArray(rawConfig, 'forbiddenFiles', normalizeRelativePath),
    ignore: normalizeStringArray(rawConfig, 'ignore', normalizeIgnorePattern)
  };
}

function loadConfig(inputPath, options) {
  const cwd = options && options.cwd ? options.cwd : process.cwd();
  const configPath = path.resolve(cwd, inputPath);

  if (!pathExists(configPath) || !isFile(configPath)) {
    throw new Error(`Config file not found: ${configPath}`);
  }

  let rawConfig;

  try {
    rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8').replace(/^\uFEFF/, ''));
  } catch (error) {
    throw new Error(`Config file must contain valid JSON: ${configPath}`);
  }

  return normalizeConfig(rawConfig, configPath);
}

function mergeIgnorePatterns(config, cliIgnorePatterns) {
  const configIgnore = config && Array.isArray(config.ignore) ? config.ignore : [];
  return uniqueStrings(configIgnore.concat(cliIgnorePatterns || []));
}

function projectPath(targetPath, relativePath) {
  return path.join(targetPath, relativePath);
}

function createConfigCheck(type, itemPath, passed) {
  return {
    type,
    path: itemPath,
    passed
  };
}

function applyConfigResult(result, scan, config) {
  if (!config) {
    return result;
  }

  const checks = [];

  config.requiredFiles.forEach((filePath) => {
    checks.push(createConfigCheck('requiredFile', filePath, isFile(projectPath(scan.targetPath, filePath))));
  });

  config.requiredDirectories.forEach((directoryPath) => {
    checks.push(createConfigCheck('requiredDirectory', directoryPath, isDirectory(projectPath(scan.targetPath, directoryPath))));
  });

  config.requiredPackageScripts.forEach((scriptName) => {
    const scripts = scan.packageJson.data && scan.packageJson.data.scripts ? scan.packageJson.data.scripts : {};
    checks.push(createConfigCheck('requiredPackageScript', scriptName, Boolean(scripts[scriptName])));
  });

  config.forbiddenFiles.forEach((filePath) => {
    checks.push(createConfigCheck('forbiddenFile', filePath, !pathExists(projectPath(scan.targetPath, filePath))));
  });

  result.config = {
    path: config.path,
    minScore: config.minScore,
    failOnMissingConfigRequirements: config.failOnMissingConfigRequirements,
    ignore: config.ignore.slice(),
    passed: checks.every((check) => check.passed),
    checks
  };

  return result;
}

module.exports = {
  applyConfigResult,
  loadConfig,
  mergeIgnorePatterns,
  normalizeConfig,
  normalizeIgnorePattern,
  normalizeIgnorePatterns
};
