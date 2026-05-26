'use strict';

const agentsMd = `# AGENTS.md

## Project Overview

Describe what this project does, who uses it, and the main problem it solves.

## Repository Structure

\`\`\`text
src/        implementation source
tests/      test suite
docs/       deeper project documentation
examples/   sample inputs, fixtures, or demos
\`\`\`

Update this section so AI coding agents can quickly understand where important files live.

## How to Run

\`\`\`sh
npm start
\`\`\`

Replace this with the real commands needed to run the project locally.

## How to Test

\`\`\`sh
npm test
\`\`\`

Document any additional test, lint, build, or check commands.

## Coding Guidelines

- Keep changes focused and easy to review.
- Follow the existing project style.
- Prefer small, testable functions.
- Update documentation when user-facing behavior changes.

## Files You Should Read First

- README.md
- package.json
- src/
- tests/

Adjust this list for the files that best explain the project.

## Do Not Do

- Do not commit real secrets.
- Do not overwrite user changes.
- Do not add dependencies without a clear reason.
- Do not change public behavior without updating tests and documentation.

## Before Submitting Changes

\`\`\`sh
npm test
\`\`\`

Add any project-specific validation commands here.
`;

const envExample = `# Copy this file to .env for local development.
# Do not commit real secrets or production credentials.

EXAMPLE_API_URL=https://example.com
EXAMPLE_FEATURE_FLAG=false
`;

const contributingMd = `# Contributing

## Set Up

\`\`\`sh
npm install
\`\`\`

If this project does not require installation, document the correct setup steps here.

## Run Tests

\`\`\`sh
npm test
\`\`\`

Run the relevant tests before submitting a change.

## Submit Changes

- Keep pull requests focused.
- Explain what changed and why.
- Include tests or documentation updates when behavior changes.

## Code Style

- Follow the existing code style.
- Prefer clear names and small functions.
- Avoid unrelated formatting-only changes.

## Issues and Pull Requests

- Use issues to report bugs or propose significant changes.
- Link related issues from pull requests when possible.
- Include reproduction steps for bug reports.
`;

const docsReadme = `# Documentation

Use this directory for deeper project documentation, architecture notes, design decisions, and operational guides.
`;

const examplesReadme = `# Examples

Use this directory for sample inputs, fixtures, demo projects, or usage examples that help people and AI coding agents understand the project.
`;

module.exports = {
  agentsMd,
  contributingMd,
  docsReadme,
  envExample,
  examplesReadme
};
