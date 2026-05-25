'use strict';

const fs = require('fs');
const path = require('path');
const { scanProject } = require('./scanner');
const { scoreProject } = require('./scorer');
const { formatTextReport, formatJsonReport } = require('./reporter');
const {
  DEFAULT_LANGUAGE,
  getMessages,
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
    `  --json              ${messages.json}`,
    `  --output <file>     ${messages.output}`,
    `  --lang <ko|en>      ${messages.lang}`,
    `  --help              ${messages.help}`,
    `  --version           ${messages.version}`,
    '',
    messages.examples,
    '  node bin/ai-ready-score.js',
    '  node bin/ai-ready-score.js .',
    '  node bin/ai-ready-score.js ./examples/good-project',
    '  node bin/ai-ready-score.js . --lang en',
    '  node bin/ai-ready-score.js --json',
    '  node bin/ai-ready-score.js --output report.json'
  ].join('\n');
}

function parseArgs(args) {
  const options = {
    targetPath: '.',
    json: false,
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

  return options;
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
    const scan = scanProject(parsed.targetPath, { cwd });
    const result = scoreProject(scan);
    const report = parsed.json || parsed.output ? formatJsonReport(result) : formatTextReport(result, { lang: parsed.lang });

    if (parsed.output) {
      const outputPath = writeOutputFile(parsed.output, report, cwd);
      stdout.write(`Report written to ${outputPath}\n`);
      return 0;
    }

    stdout.write(parsed.json ? `${report}\n` : report);
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
  getHelpText,
  getPackageVersion
};
