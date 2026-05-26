'use strict';

const { categories, rules } = require('./rules');

const MAX_SCORE = 100;

function getGrade(score) {
  if (score >= 90) {
    return 'A';
  }

  if (score >= 80) {
    return 'B';
  }

  if (score >= 70) {
    return 'C';
  }

  if (score >= 60) {
    return 'D';
  }

  return 'F';
}

function scoreProject(scan) {
  const categoryResults = {};
  const checkResults = [];
  const recommendations = [];

  categories.forEach((category) => {
    categoryResults[category.id] = {
      id: category.id,
      name: category.name,
      score: 0,
      maxScore: category.maxScore
    };
  });

  rules.forEach((rule) => {
    let passed = false;

    try {
      passed = Boolean(rule.test(scan));
    } catch (error) {
      passed = false;
    }

    const pointsEarned = passed ? rule.points : 0;
    categoryResults[rule.category].score += pointsEarned;

    checkResults.push({
      id: rule.id,
      category: rule.category,
      label: rule.label,
      passed,
      points: pointsEarned,
      maxPoints: rule.points,
      recommendation: passed ? null : rule.recommendation
    });

    if (!passed && !recommendations.includes(rule.recommendation)) {
      recommendations.push(rule.recommendation);
    }
  });

  const rawScore = Object.keys(categoryResults).reduce((total, categoryId) => {
    return total + categoryResults[categoryId].score;
  }, 0);
  const score = Math.max(0, Math.min(MAX_SCORE, rawScore));

  return {
    targetPath: scan.targetPath,
    score,
    maxScore: MAX_SCORE,
    grade: getGrade(score),
    categories: categoryResults,
    checks: checkResults,
    recommendations,
    ignored: scan.ignored ? scan.ignored.slice() : [],
    ignorePatterns: scan.ignorePatterns ? scan.ignorePatterns.slice() : [],
    warnings: scan.warnings.slice()
  };
}

module.exports = {
  MAX_SCORE,
  getGrade,
  scoreProject
};
