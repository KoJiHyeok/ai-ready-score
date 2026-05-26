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

function formatSkippedItem(item, messages) {
  if (item.reason === 'already exists') {
    return `${item.path} ${messages.init.alreadyExists}`;
  }

  return item.path;
}

function formatInitTextReport(result, options) {
  const language = options && options.lang ? options.lang : DEFAULT_LANGUAGE;
  const messages = getMessages(language);
  const init = messages.init;
  const lines = [];

  lines.push(init.completed);
  lines.push('');
  lines.push(`${init.targetPath}: ${result.targetPath}`);
  lines.push('');

  if (result.created.length === 0) {
    lines.push(init.nothingCreated);
    lines.push('');
  }

  lines.push(`${init.createdItems}:`);
  if (result.created.length === 0) {
    lines.push(`- ${init.none}`);
  } else {
    result.created.forEach((item) => {
      lines.push(`- ${item.path}`);
    });
  }

  lines.push('');
  lines.push(`${init.skippedItems}:`);
  if (result.skipped.length === 0) {
    lines.push(`- ${init.none}`);
  } else {
    result.skipped.forEach((item) => {
      lines.push(`- ${formatSkippedItem(item, messages)}`);
    });
  }

  return `${lines.join('\n')}\n`;
}

function formatInitMarkdownReport(result, options) {
  const language = options && options.lang ? options.lang : DEFAULT_LANGUAGE;
  const messages = getMessages(language);
  const init = messages.init;
  const lines = [];

  lines.push(`# ${init.markdownTitle}`);
  lines.push('');
  lines.push(`- **${init.targetPath}:** ${result.targetPath}`);
  lines.push('');

  if (result.created.length === 0) {
    lines.push(init.nothingCreated);
    lines.push('');
  }

  lines.push(`## ${init.createdItems}`);
  lines.push('');
  if (result.created.length === 0) {
    lines.push(`- ${init.none}`);
  } else {
    result.created.forEach((item) => {
      lines.push(`- ${item.path}`);
    });
  }

  lines.push('');
  lines.push(`## ${init.skippedItems}`);
  lines.push('');
  if (result.skipped.length === 0) {
    lines.push(`- ${init.none}`);
  } else {
    result.skipped.forEach((item) => {
      lines.push(`- ${formatSkippedItem(item, messages)}`);
    });
  }

  return `${lines.join('\n')}\n`;
}

function formatTextReport(result, options) {
  const language = options && options.lang ? options.lang : DEFAULT_LANGUAGE;
  const messages = getMessages(language);
  const report = messages.report;
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

  lines.push('');
  lines.push(`${report.categoryBreakdown}:`);

  Object.keys(result.categories).forEach((categoryId) => {
    const category = result.categories[categoryId];
    lines.push(`- ${getCategoryName(category, messages)}: ${category.score}/${category.maxScore}`);
  });

  lines.push('');
  lines.push(`${report.passedChecks}:`);
  if (passedChecks.length === 0) {
    lines.push(`- ${report.none}`);
  } else {
    passedChecks.forEach((check) => {
      lines.push(`- [${report.pass}] ${getCheckLabel(check, messages)} (${check.points}/${check.maxPoints})`);
    });
  }

  lines.push('');
  lines.push(`${report.failedChecks}:`);
  if (failedChecks.length === 0) {
    lines.push(`- ${report.none}`);
  } else {
    failedChecks.forEach((check) => {
      lines.push(`- [${report.fail}] ${getCheckLabel(check, messages)} (0/${check.maxPoints})`);
    });
  }

  lines.push('');
  lines.push(`${report.warnings}:`);
  if (result.warnings.length === 0) {
    lines.push(`- ${report.none}`);
  } else {
    result.warnings.forEach((warning) => {
      lines.push(`- ${translateWarning(warning, language)}`);
    });
  }

  lines.push('');
  lines.push(`${report.recommendations}:`);
  if (failedChecks.length === 0) {
    lines.push(`- ${report.noRecommendations}`);
  } else {
    getUniqueRecommendations(failedChecks, messages).forEach((recommendation) => {
      lines.push(`- ${recommendation}`);
    });
  }

  return `${lines.join('\n')}\n`;
}

function formatMarkdownReport(result, options) {
  const language = options && options.lang ? options.lang : DEFAULT_LANGUAGE;
  const messages = getMessages(language);
  const markdown = messages.markdown;
  const report = messages.report;
  const lines = [];
  const passedChecks = result.checks.filter((check) => check.passed);
  const failedChecks = result.checks.filter((check) => !check.passed);

  lines.push(`# ${markdown.title}`);
  lines.push('');
  lines.push(`- **${markdown.target}:** ${result.targetPath}`);
  lines.push(`- **${markdown.score}:** ${result.score}/${result.maxScore}`);
  lines.push(`- **${markdown.grade}:** ${result.grade}`);

  if (result.threshold) {
    lines.push(`- **${messages.report.threshold}:** ${formatThresholdMessage(result.threshold, result, messages)}`);
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
  lines.push(`## ${markdown.passedChecks}`);
  lines.push('');
  if (passedChecks.length === 0) {
    lines.push(`- ${report.none}`);
  } else {
    passedChecks.forEach((check) => {
      lines.push(`- ${getCheckLabel(check, messages)} (${check.points}/${check.maxPoints})`);
    });
  }

  lines.push('');
  lines.push(`## ${markdown.failedChecks}`);
  lines.push('');
  if (failedChecks.length === 0) {
    lines.push(`- ${report.none}`);
  } else {
    failedChecks.forEach((check) => {
      lines.push(`- ${getCheckLabel(check, messages)} (0/${check.maxPoints})`);
    });
  }

  lines.push('');
  lines.push(`## ${markdown.warnings}`);
  lines.push('');
  if (result.warnings.length === 0) {
    lines.push(`- ${report.none}`);
  } else {
    result.warnings.forEach((warning) => {
      lines.push(`- ${translateWarning(warning, language)}`);
    });
  }

  lines.push('');
  lines.push(`## ${markdown.recommendations}`);
  lines.push('');
  if (failedChecks.length === 0) {
    lines.push(`- ${report.noRecommendations}`);
  } else {
    getUniqueRecommendations(failedChecks, messages).forEach((recommendation) => {
      lines.push(`- ${recommendation}`);
    });
  }

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
