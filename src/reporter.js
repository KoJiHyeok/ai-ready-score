'use strict';

function formatJsonReport(result) {
  return JSON.stringify(result, null, 2);
}

function formatTextReport(result) {
  const lines = [];
  const passedChecks = result.checks.filter((check) => check.passed);
  const failedChecks = result.checks.filter((check) => !check.passed);

  lines.push('ai-ready-score');
  lines.push('');
  lines.push(`Target path: ${result.targetPath}`);
  lines.push(`Total score: ${result.score}/${result.maxScore}`);
  lines.push(`Grade: ${result.grade}`);
  lines.push('');
  lines.push('Category breakdown:');

  Object.keys(result.categories).forEach((categoryId) => {
    const category = result.categories[categoryId];
    lines.push(`- ${category.name}: ${category.score}/${category.maxScore}`);
  });

  lines.push('');
  lines.push('Passed checks:');
  if (passedChecks.length === 0) {
    lines.push('- None');
  } else {
    passedChecks.forEach((check) => {
      lines.push(`- [pass] ${check.label} (${check.points}/${check.maxPoints})`);
    });
  }

  lines.push('');
  lines.push('Failed checks:');
  if (failedChecks.length === 0) {
    lines.push('- None');
  } else {
    failedChecks.forEach((check) => {
      lines.push(`- [fail] ${check.label} (0/${check.maxPoints})`);
    });
  }

  lines.push('');
  lines.push('Warnings:');
  if (result.warnings.length === 0) {
    lines.push('- None');
  } else {
    result.warnings.forEach((warning) => {
      lines.push(`- ${warning}`);
    });
  }

  lines.push('');
  lines.push('Recommended next steps:');
  if (result.recommendations.length === 0) {
    lines.push('- No immediate next steps. Keep docs and tests current as the project changes.');
  } else {
    result.recommendations.forEach((recommendation) => {
      lines.push(`- ${recommendation}`);
    });
  }

  return `${lines.join('\n')}\n`;
}

module.exports = {
  formatTextReport,
  formatJsonReport
};
