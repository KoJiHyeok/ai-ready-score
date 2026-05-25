'use strict';

const { DEFAULT_LANGUAGE, getMessages, translateWarning } = require('./i18n');

function formatJsonReport(result) {
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
    const seenRecommendations = new Set();

    failedChecks.forEach((check) => {
      const recommendation = getRecommendation(check, messages);

      if (!seenRecommendations.has(recommendation)) {
        seenRecommendations.add(recommendation);
        lines.push(`- ${recommendation}`);
      }
    });
  }

  return `${lines.join('\n')}\n`;
}

module.exports = {
  formatTextReport,
  formatJsonReport
};
