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

// Returns true if `text` contains a Markdown section whose heading title matches
// one of `headingKeywords` AND that section contains a fenced code block.
//
// Why this is stricter than hasAnyKeyword: a bare keyword match passes whenever
// the word appears anywhere, so a README can score points by sprinkling "usage"
// into prose. A real usage/example section almost always shows a runnable
// command inside a fenced code block, so requiring a matching heading PLUS a
// code fence inside that section raises the cost of gaming the score. It still
// only verifies structure, not the quality of the command itself.
//
// A section runs from its heading until the next heading of the same or higher
// level (so nested subsections still count). We short-circuit on the first code
// fence found inside the section, which means lines inside the fenced block are
// never parsed as headings.
function hasSectionWithCodeBlock(text, headingKeywords) {
  const lines = String(text || '').split(/\r?\n/);
  const keywords = headingKeywords.map((keyword) => keyword.toLowerCase());
  let sectionLevel = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);

    if (heading) {
      const level = heading[1].length;
      const title = heading[2].toLowerCase();

      if (sectionLevel !== null && level <= sectionLevel) {
        sectionLevel = null;
      }

      if (sectionLevel === null && keywords.some((keyword) => title.includes(keyword))) {
        sectionLevel = level;
      }
      continue;
    }

    if (sectionLevel !== null && (trimmed.startsWith('```') || trimmed.startsWith('~~~'))) {
      return true;
    }
  }

  return false;
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
  hasAnyKeyword,
  hasSectionWithCodeBlock
};
