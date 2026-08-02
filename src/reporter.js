'use strict';

const { DEFAULT_LANGUAGE, getMessages, translateWarning } = require('./i18n');

function formatJsonReport(result) {
  return JSON.stringify(result, null, 2);
}

function formatInitJsonReport(result) {
  return JSON.stringify(result, null, 2);
}

function getCategoryName(category, messages) {
  return messages.categories[category.id] || category.name;
}

function getCheckLabel(check, messages) {
  return messages.checks[check.id] || check.label;
}

function getRecommendation(check, messages) {
  return messages.recommendations[check.id] || check.recommendation;
}

function getUniqueRecommendations(failedChecks, messages) {
  const recommendations = [];
  const seenRecommendations = new Set();

  failedChecks.forEach((check) => {
    const recommendation = getRecommendation(check, messages);

    if (!seenRecommendations.has(recommendation)) {
      seenRecommendations.add(recommendation);
      recommendations.push(recommendation);
    }
  });

  return recommendations;
}

function escapeMarkdownTableCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function formatThresholdMessage(threshold, result, messages) {
  const template = threshold.passed ? messages.report.thresholdPassed : messages.report.thresholdFailed;

  return template
    .replace('{score}', String(result.score))
    .replace('{maxScore}', String(result.maxScore))
    .replace('{minScore}', String(threshold.minScore));
}

function formatConfigCheckLabel(check, messages) {
  const report = messages.report;

  if (check.type === 'requiredFile') {
    return report.configRequiredFile.replace('{path}', check.path);
  }

  if (check.type === 'requiredDirectory') {
    return report.configRequiredDirectory.replace('{path}', check.path);
  }

  if (check.type === 'requiredPackageScript') {
    return report.configRequiredPackageScript.replace('{path}', check.path);
  }

  if (check.type === 'forbiddenFile') {
    return report.configForbiddenFile.replace('{path}', check.path);
  }

  return check.path;
}

function formatIgnoredItem(item, messages) {
  return messages.report.ignoredItem
    .replace('{path}', item.path)
    .replace('{type}', item.type)
    .replace('{pattern}', item.pattern);
}

function formatSkippedItem(item, messages) {
  if (item.reason === 'already exists') {
    return `${item.path} ${messages.init.alreadyExists}`;
  }

  return item.path;
}

function resolveReportContext(options) {
  const language = options && options.lang ? options.lang : DEFAULT_LANGUAGE;
  return { language, messages: getMessages(language) };
}

function appendListSection(lines, heading, items, emptyLine, renderItem) {
  lines.push(...heading);
  if (items.length === 0) {
    lines.push(emptyLine);
  } else {
    items.forEach((item) => {
      lines.push(renderItem(item));
    });
  }
}

function appendWarningsSection(lines, heading, warnings, language, emptyLine) {
  lines.push(...heading);
  if (warnings.length === 0) {
    lines.push(emptyLine);
  } else {
    warnings.forEach((warning) => {
      lines.push(`- ${translateWarning(warning, language)}`);
    });
  }
}

function appendConfigSection(lines, config, messages, emptyLine, style) {
  const report = messages.report;

  lines.push(...style.configHeading(report.configuredChecks));
  lines.push(style.keyValueLine(report.configFile, config.path));
  lines.push(style.keyValueLine(
    report.configFailureMode,
    config.failOnMissingConfigRequirements ? report.configFailureEnabled : report.configFailureDisabled
  ));
  if (config.checks.length === 0) {
    lines.push(emptyLine);
  } else {
    config.checks.forEach((check) => {
      lines.push(style.configCheckLine(check, formatConfigCheckLabel(check, messages)));
    });
  }
  lines.push('');
}

function appendIgnoredSection(lines, result, messages, emptyLine, style) {
  const report = messages.report;

  lines.push(...style.ignoredHeading(report.ignoredItems));
  lines.push(style.keyValueLine(report.ignorePatterns, result.ignorePatterns.join(', ')));
  if (!result.ignored || result.ignored.length === 0) {
    lines.push(emptyLine);
  } else {
    result.ignored.forEach((item) => {
      lines.push(`- ${formatIgnoredItem(item, messages)}`);
    });
  }
  lines.push('');
}

function appendRecommendationsSection(lines, heading, failedChecks, messages, emptyLine) {
  lines.push(...heading);
  if (failedChecks.length === 0) {
    lines.push(emptyLine);
  } else {
    getUniqueRecommendations(failedChecks, messages).forEach((recommendation) => {
      lines.push(`- ${recommendation}`);
    });
  }
}

function formatInitTextReport(result, options) {
  const { messages } = resolveReportContext(options);
  const init = messages.init;
  const emptyLine = `- ${init.none}`;
  const lines = [];

  lines.push(init.completed);
  lines.push('');
  lines.push(`${init.targetPath}: ${result.targetPath}`);
  lines.push('');

  if (result.created.length === 0) {
    lines.push(init.nothingCreated);
    lines.push('');
  }

  appendListSection(lines, [`${init.createdItems}:`], result.created, emptyLine, (item) => `- ${item.path}`);

  lines.push('');
  appendListSection(lines, [`${init.skippedItems}:`], result.skipped, emptyLine, (item) =>
    `- ${formatSkippedItem(item, messages)}`);

  return `${lines.join('\n')}\n`;
}

function formatInitMarkdownReport(result, options) {
  const { messages } = resolveReportContext(options);
  const init = messages.init;
  const emptyLine = `- ${init.none}`;
  const lines = [];

  lines.push(`# ${init.markdownTitle}`);
  lines.push('');
  lines.push(`- **${init.targetPath}:** ${result.targetPath}`);
  lines.push('');

  if (result.created.length === 0) {
    lines.push(init.nothingCreated);
    lines.push('');
  }

  appendListSection(lines, [`## ${init.createdItems}`, ''], result.created, emptyLine, (item) => `- ${item.path}`);

  lines.push('');
  appendListSection(lines, [`## ${init.skippedItems}`, ''], result.skipped, emptyLine, (item) =>
    `- ${formatSkippedItem(item, messages)}`);

  return `${lines.join('\n')}\n`;
}

function formatTextReport(result, options) {
  const { language, messages } = resolveReportContext(options);
  const report = messages.report;
  const emptyLine = `- ${report.none}`;
  const style = {
    configHeading: (title) => [`${title}:`],
    ignoredHeading: (title) => [`${title}:`],
    keyValueLine: (key, value) => `- ${key}: ${value}`,
    configCheckLine: (check, label) => `- [${check.passed ? report.pass : report.fail}] ${label}`
  };
  const lines = [];
  const passedChecks = result.checks.filter((check) => check.passed);
  const failedChecks = result.checks.filter((check) => !check.passed);

  lines.push(report.title);
  lines.push('');
  lines.push(`${report.targetPath}: ${result.targetPath}`);
  lines.push(`${report.totalScore}: ${result.score}/${result.maxScore}`);
  lines.push(`${report.grade}: ${result.grade}`);

  if (result.threshold) {
    lines.push(`${report.threshold}: ${formatThresholdMessage(result.threshold, result, messages)}`);
  }

  if (result.config) {
    lines.push(`${report.configStatus}: ${result.config.passed ? report.configPassed : report.configFailed}`);
  }

  lines.push('');
  lines.push(`${report.categoryBreakdown}:`);

  Object.keys(result.categories).forEach((categoryId) => {
    const category = result.categories[categoryId];
    lines.push(`- ${getCategoryName(category, messages)}: ${category.score}/${category.maxScore}`);
  });

  lines.push('');
  appendListSection(lines, [`${report.passedChecks}:`], passedChecks, emptyLine, (check) =>
    `- [${report.pass}] ${getCheckLabel(check, messages)} (${check.points}/${check.maxPoints})`);

  lines.push('');
  appendListSection(lines, [`${report.failedChecks}:`], failedChecks, emptyLine, (check) =>
    `- [${report.fail}] ${getCheckLabel(check, messages)} (0/${check.maxPoints})`);

  lines.push('');
  appendWarningsSection(lines, [`${report.warnings}:`], result.warnings, language, emptyLine);

  lines.push('');
  if (result.config) {
    appendConfigSection(lines, result.config, messages, emptyLine, style);
  }

  if (result.ignorePatterns && result.ignorePatterns.length > 0) {
    appendIgnoredSection(lines, result, messages, emptyLine, style);
  }

  appendRecommendationsSection(lines, [`${report.recommendations}:`], failedChecks, messages, `- ${report.noRecommendations}`);

  return `${lines.join('\n')}\n`;
}

function formatMarkdownReport(result, options) {
  const { language, messages } = resolveReportContext(options);
  const markdown = messages.markdown;
  const report = messages.report;
  const emptyLine = `- ${report.none}`;
  const style = {
    configHeading: (title) => [`## ${title}`, ''],
    ignoredHeading: (title) => [`## ${title}`, ''],
    keyValueLine: (key, value) => `- **${key}:** ${value}`,
    configCheckLine: (check, label) => `- ${check.passed ? report.pass : report.fail}: ${label}`
  };
  const lines = [];
  const passedChecks = result.checks.filter((check) => check.passed);
  const failedChecks = result.checks.filter((check) => !check.passed);

  lines.push(`# ${markdown.title}`);
  lines.push('');
  lines.push(`- **${markdown.target}:** ${result.targetPath}`);
  lines.push(`- **${markdown.score}:** ${result.score}/${result.maxScore}`);
  lines.push(`- **${markdown.grade}:** ${result.grade}`);

  if (result.threshold) {
    lines.push(`- **${report.threshold}:** ${formatThresholdMessage(result.threshold, result, messages)}`);
  }

  if (result.config) {
    lines.push(`- **${report.configStatus}:** ${result.config.passed ? report.configPassed : report.configFailed}`);
  }

  lines.push('');
  lines.push(`## ${markdown.categoryBreakdown}`);
  lines.push('');
  lines.push(`| ${markdown.category} | ${markdown.points} |`);
  lines.push('| --- | ---: |');

  Object.keys(result.categories).forEach((categoryId) => {
    const category = result.categories[categoryId];
    lines.push(`| ${escapeMarkdownTableCell(getCategoryName(category, messages))} | ${category.score}/${category.maxScore} |`);
  });

  lines.push('');
  appendListSection(lines, [`## ${markdown.passedChecks}`, ''], passedChecks, emptyLine, (check) =>
    `- ${getCheckLabel(check, messages)} (${check.points}/${check.maxPoints})`);

  lines.push('');
  appendListSection(lines, [`## ${markdown.failedChecks}`, ''], failedChecks, emptyLine, (check) =>
    `- ${getCheckLabel(check, messages)} (0/${check.maxPoints})`);

  lines.push('');
  appendWarningsSection(lines, [`## ${markdown.warnings}`, ''], result.warnings, language, emptyLine);

  lines.push('');
  if (result.config) {
    appendConfigSection(lines, result.config, messages, emptyLine, style);
  }

  if (result.ignorePatterns && result.ignorePatterns.length > 0) {
    appendIgnoredSection(lines, result, messages, emptyLine, style);
  }

  appendRecommendationsSection(lines, [`## ${markdown.recommendations}`, ''], failedChecks, messages, `- ${report.noRecommendations}`);

  return `${lines.join('\n')}\n`;
}

module.exports = {
  formatTextReport,
  formatMarkdownReport,
  formatJsonReport,
  formatInitTextReport,
  formatInitMarkdownReport,
  formatInitJsonReport
};
