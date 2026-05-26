'use strict';

const fs = require('fs');
const path = require('path');
const { applyConfigResult, loadConfig } = require('./config');
const { initializeProject } = require('./initializer');
const { scanProject } = require('./scanner');
const { scoreProject } = require('./scorer');
const {
  formatTextReport,
  formatMarkdownReport,
  formatJsonReport,
  formatInitTextReport,
  formatInitMarkdownReport,
  formatInitJsonReport
} = require('./reporter');
const {
  DEFAULT_LANGUAGE,
  getConfigInitConflictError,
  getInvalidMinScoreError,
  getMessages,
  getMinScoreInitConflictError,
  getOutputFormatConflictError,
  getUnsupportedLanguageError,
  isSupportedLanguage,
  normalizeLanguage
} = require('./i18n');

function getPackageVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.version || '0.0.0';
  } catch (error) {
    return '0.0.0';
  }
}

function getHelpText(language) {
  const messages = getMessages(language).help;

  return [
    'ai-ready-score',
    '',
    messages.description,
    '',
    messages.usage,
    '  node bin/ai-ready-score.js [path] [options]',
    '',
    messages.options,
    `  --init              ${messages.init}`,
    `  --min-score <0-100> ${messages.minScore}`,
    `  --config <file>     ${messages.config || 'JSON 설정 파일에서 프로젝트별 검사를 읽습니다'}`,
    `  --json              ${messages.json}`,
    `  --markdown          ${messages.markdown}`,
    `  --output <file>     ${messages.output}`,
    `  --lang <ko|en>      ${messages.lang}`,
    `  --help              ${messages.help}`,
    `  --version           ${messages.version}`,
    '',
    messages.examples,
    '  node bin/ai-ready-score.js',
    '  node bin/ai-ready-score.js .',
    '  node bin/ai-ready-score.js --init',
    '  node bin/ai-ready-score.js ./some-project --init',
    '  node bin/ai-ready-score.js . --min-score 80',
    '  node bin/ai-ready-score.js . --config ai-ready-score.config.json',
    '  node bin/ai-ready-score.js ./examples/good-project',
    '  node bin/ai-ready-score.js . --lang en',
    '  node bin/ai-ready-score.js --json',
    '  node bin/ai-ready-score.js . --markdown',
    '  node bin/ai-ready-score.js --output report.json'
  ].join('\n');
}

function parseArgs(args) {
  const options = {
    targetPath: '.',
    init: false,
    minScore: null,
    config: null,
    json: false,
    markdown: false,
    output: null,
    lang: DEFAULT_LANGUAGE,
    help: false,
    version: false,
    errors: []
  };
  let targetPathSet = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }

    if (arg === '--version' || arg === '-v') {
      options.version = true;
      continue;
    }

    if (arg === '--json') {
      options.json = true;
      continue;
    }

    if (arg === '--init') {
      options.init = true;
      continue;
    }

    if (arg === '--markdown') {
      options.markdown = true;
      continue;
    }

    if (arg === '--min-score') {
      const minScore = args[index + 1];

      if (!minScore || minScore.startsWith('--')) {
        options.errors.push(getInvalidMinScoreError(minScore || '', options.lang));
      } else {
        const parsedMinScore = Number(minScore);

        if (!Number.isFinite(parsedMinScore) || parsedMinScore < 0 || parsedMinScore > 100) {
          options.errors.push(getInvalidMinScoreError(minScore, options.lang));
        } else {
          options.minScore = parsedMinScore;
        }

        index += 1;
      }
      continue;
    }

    if (arg.startsWith('--min-score=')) {
      const minScore = arg.slice('--min-score='.length);
      const parsedMinScore = Number(minScore);

      if (!minScore || !Number.isFinite(parsedMinScore) || parsedMinScore < 0 || parsedMinScore > 100) {
        options.errors.push(getInvalidMinScoreError(minScore, options.lang));
      } else {
        options.minScore = parsedMinScore;
      }
      continue;
    }

    if (arg === '--config') {
      const configPath = args[index + 1];

      if (!configPath || configPath.startsWith('--')) {
        options.errors.push('--config requires a file path.');
      } else {
        options.config = configPath;
        index += 1;
      }
      continue;
    }

    if (arg.startsWith('--config=')) {
      const configPath = arg.slice('--config='.length);

      if (!configPath) {
        options.errors.push('--config requires a file path.');
      } else {
        options.config = configPath;
      }
      continue;
    }

    if (arg === '--lang') {
      const language = args[index + 1];

      if (!language || language.startsWith('--')) {
        options.errors.push('--lang requires ko or en.');
      } else if (!isSupportedLanguage(language)) {
        options.errors.push(getUnsupportedLanguageError(language));
        index += 1;
      } else {
        options.lang = normalizeLanguage(language);
        index += 1;
      }
      continue;
    }

    if (arg.startsWith('--lang=')) {
      const language = arg.slice('--lang='.length);

      if (!language) {
        options.errors.push('--lang requires ko or en.');
      } else if (!isSupportedLanguage(language)) {
        options.errors.push(getUnsupportedLanguageError(language));
      } else {
        options.lang = normalizeLanguage(language);
      }
      continue;
    }

    if (arg === '--output' || arg === '-o') {
      const outputPath = args[index + 1];

      if (!outputPath || outputPath.startsWith('--')) {
        options.errors.push('--output requires a file path.');
      } else {
        options.output = outputPath;
        index += 1;
      }
      continue;
    }

    if (arg.startsWith('--')) {
      options.errors.push(`Unknown option: ${arg}`);
      continue;
    }

    if (targetPathSet) {
      options.errors.push(`Unexpected argument: ${arg}`);
      continue;
    }

    options.targetPath = arg;
    targetPathSet = true;
  }

  if (options.json && options.markdown) {
    options.errors.push(getOutputFormatConflictError(options.lang));
  }

  if (options.init && options.minScore !== null) {
    options.errors.push(getMinScoreInitConflictError(options.lang));
  }

  if (options.init && options.config !== null) {
    options.errors.push(getConfigInitConflictError(options.lang));
  }

  return options;
}

function addThresholdResult(result, minScore) {
  if (minScore === null) {
    return result;
  }

  result.threshold = {
    minScore,
    passed: result.score >= minScore
  };

  return result;
}

function shouldFail(result) {
  if (result.threshold && !result.threshold.passed) {
    return true;
  }

  if (result.config && result.config.failOnMissingConfigRequirements && !result.config.passed) {
    return true;
  }

  return false;
}

function writeOutputFile(outputPath, content, cwd) {
  const resolvedOutputPath = path.resolve(cwd, outputPath);
  fs.writeFileSync(resolvedOutputPath, content, 'utf8');
  return resolvedOutputPath;
}

function runCli(args, environment) {
  const env = environment || {};
  const stdout = env.stdout || process.stdout;
  const stderr = env.stderr || process.stderr;
  const exit = env.exit || process.exit;
  const cwd = env.cwd || process.cwd();
  const parsed = parseArgs(args || []);

  if (parsed.help) {
    stdout.write(`${getHelpText(parsed.lang)}\n`);
    return 0;
  }

  if (parsed.version) {
    stdout.write(`${getPackageVersion()}\n`);
    return 0;
  }

  if (parsed.errors.length > 0) {
    parsed.errors.forEach((error) => {
      stderr.write(`${error}\n`);
    });
    stderr.write('Run with --help for usage.\n');
    if (exit) {
      exit(1);
    }
    return 1;
  }

  try {
    if (parsed.init) {
      const initResult = initializeProject(parsed.targetPath, { cwd });
      let initReport;

      if (parsed.json || (parsed.output && !parsed.markdown)) {
        initReport = formatInitJsonReport(initResult);
      } else if (parsed.markdown) {
        initReport = formatInitMarkdownReport(initResult, { lang: parsed.lang });
      } else {
        initReport = formatInitTextReport(initResult, { lang: parsed.lang });
      }

      if (parsed.output) {
        const outputPath = writeOutputFile(parsed.output, initReport, cwd);
        stdout.write(`Report written to ${outputPath}\n`);
        return 0;
      }

      stdout.write(parsed.json ? `${initReport}\n` : initReport);
      return 0;
    }

    const config = parsed.config ? loadConfig(parsed.config, { cwd }) : null;
    const scan = scanProject(parsed.targetPath, { cwd });
    const configuredResult = applyConfigResult(scoreProject(scan), scan, config);
    const effectiveMinScore = parsed.minScore !== null ? parsed.minScore : config && config.minScore;
    const result = addThresholdResult(configuredResult, effectiveMinScore === null ? null : effectiveMinScore);
    let report;

    if (parsed.json) {
      report = formatJsonReport(result);
    } else if (parsed.markdown) {
      report = formatMarkdownReport(result, { lang: parsed.lang });
    } else if (parsed.output) {
      report = formatJsonReport(result);
    } else {
      report = formatTextReport(result, { lang: parsed.lang });
    }

    if (parsed.output) {
      const outputPath = writeOutputFile(parsed.output, report, cwd);
      stdout.write(`Report written to ${outputPath}\n`);
      if (shouldFail(result)) {
        if (exit) {
          exit(1);
        }
        return 1;
      }
      return 0;
    }

    stdout.write(parsed.json ? `${report}\n` : report);
    if (shouldFail(result)) {
      if (exit) {
        exit(1);
      }
      return 1;
    }
    return 0;
  } catch (error) {
    stderr.write(`ai-ready-score failed: ${error.message}\n`);
    if (exit) {
      exit(1);
    }
    return 1;
  }
}

module.exports = {
  runCli,
  parseArgs,
  addThresholdResult,
  shouldFail,
  getHelpText,
  getPackageVersion
};
