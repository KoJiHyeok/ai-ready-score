# AGENTS.md

## Project Overview

`ai-ready-score` is a Node.js CLI project that scores whether a local codebase is easy for AI coding agents to understand, run, modify, and test.

The project uses JavaScript, CommonJS, Node.js 18+, and only Node.js built-in modules. It should not add AI API calls, network requests, or external npm dependencies.

## Repository Structure

```text
bin/                  CLI executable entry point
src/                  implementation modules
tests/                node:test test suite
examples/             sample projects used for validation
docs/                 supporting documentation
README.md             user-facing documentation
AGENTS.md             instructions for AI coding agents
```

Keep scanner, scorer, reporter, and CLI logic separate:

- `src/scanner.js` should detect root files, folders, package metadata, and warnings.
- `src/rules.js` should define scoring rules and categories.
- `src/scorer.js` should calculate scores, grades, checks, and recommendations.
- `src/reporter.js` should format text, Markdown, and JSON output.
- `src/i18n.js` should store translated labels and messages for human-readable output.
- `src/cli.js` should parse CLI options, run the scan, and write output.

## Runtime and Tooling

- Runtime: Node.js 18 or newer.
- Language: JavaScript.
- Module system: CommonJS with `require` and `module.exports`.
- Tests: built-in `node:test`.
- Dependencies: Node.js built-in modules only.

## How to Run

```sh
node bin/ai-ready-score.js
node bin/ai-ready-score.js .
node bin/ai-ready-score.js ./examples/good-project
node bin/ai-ready-score.js ./examples/poor-project
node bin/ai-ready-score.js . --lang ko
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js --json
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js . --markdown --lang ko
node bin/ai-ready-score.js . --markdown --lang en
node bin/ai-ready-score.js . --markdown --output report.md
node bin/ai-ready-score.js --output report.json
node bin/ai-ready-score.js --help
node bin/ai-ready-score.js --version
```

You can also use package scripts:

```sh
npm start
npm run dev
npm run check
```

## How to Test

Run the full node:test suite:

```sh
npm test
```

When changing scoring rules, update tests, README.md, AGENTS.md, and example projects so the documented rubric matches behavior.

GitHub Actions CI must keep passing for future changes. CI runs tests and CLI validation on Node.js 18, Node.js 20, and Node.js 22.

## Coding Guidelines

- Use CommonJS only.
- Use `path` for all path handling.
- Use synchronous Node.js built-in filesystem APIs for this small CLI unless there is a clear reason to change.
- Avoid external dependencies.
- Keep functions small and testable.
- Keep scanner, scorer, reporter, and CLI responsibilities separate.
- Make output stable enough for tests and shell usage.
- Keep Markdown output stable enough for GitHub comments, issues, and saved reports.
- Preserve Windows, macOS, and Linux compatibility.

## Documentation Guidelines

- README.md and release documentation are bilingual in English and Korean.
- When user-facing behavior changes, update both English and Korean documentation in the same change.
- Do not leave Korean docs outdated when English docs change.
- Do not leave English docs outdated when Korean docs change.
- Keep CHANGELOG.md, docs/release-checklist.md, and docs/release-notes/* aligned for release-related changes.

## Scoring System

Total score: 100 points.

- Documentation: 25 points.
- Project Structure: 20 points.
- Package Scripts: 20 points.
- AI Readiness: 20 points.
- GitHub & Safety Readiness: 15 points.

Grades:

- 90-100: A
- 80-89: B
- 70-79: C
- 60-69: D
- 0-59: F

## Files You Should Read First

- `README.md`
- `src/rules.js`
- `src/scorer.js`
- `src/scanner.js`
- `src/reporter.js`
- `src/i18n.js`
- `src/cli.js`
- `tests/*.test.js`

## Common Tasks

- Add or change a scoring rule in `src/rules.js`.
- Update score expectations in `tests/scorer.test.js`.
- Add scanner coverage in `tests/scanner.test.js`.
- Add CLI coverage in `tests/cli.test.js`.
- Update README.md and this file when behavior changes.

## Do Not Do

- Do not add external npm dependencies.
- Do not add AI API calls.
- Do not add network requests.
- Do not publish to npm without explicit user approval.
- Do not change version numbers casually; version changes should match an intentional release plan.
- Do not combine scanner, scorer, reporter, and CLI logic into one file.
- Do not change scoring rules without updating tests.
- Do not rely on shell-specific path separators.

## npm Publishing Checklist

Before preparing a release for npm:

- Confirm `package.json` has correct `name`, `version`, `description`, `main`, `bin`, `keywords`, `license`, `repository`, `bugs`, `homepage`, and `files`.
- Confirm `bin.ai-ready-score` points to `bin/ai-ready-score.js`.
- Confirm `bin/ai-ready-score.js` keeps the `#!/usr/bin/env node` shebang.
- Run `npm run check`.
- Run `npm pack --dry-run` and inspect the packed file list.
- Confirm generated reports such as `report.json` and `report.md` are not included unless intentionally needed.
- Get explicit user approval before running `npm publish`.

## Public Release Checklist

Before preparing a public GitHub/npm release:

- Confirm `README.md` is clear for first-time users.
- Confirm `README.md` is clear for both English-speaking and Korean-speaking first-time users.
- Confirm `CHANGELOG.md` includes the target version entry in English and Korean.
- Confirm `docs/release-checklist.md` is up to date in English and Korean.
- Confirm `docs/release-notes/` includes bilingual GitHub Release notes for the target version.
- Confirm `package.json` version matches the intended release tag.
- Run `npm test`.
- Run `npm run check`.
- Run `npm pack --dry-run`.
- Run `git status --short`.
- Create the tag only when requested: `git tag v0.1.0`.
- Push the branch only when requested: `git push origin main`.
- Push the tag only when requested: `git push origin v0.1.0`.
- Publish to npm only after explicit user approval.

## Before Submitting Changes

Run:

```sh
npm test
node bin/ai-ready-score.js
node bin/ai-ready-score.js .
node bin/ai-ready-score.js . --lang ko
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js . --json
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js . --markdown --lang ko
node bin/ai-ready-score.js . --markdown --lang en
node bin/ai-ready-score.js . --markdown --output report.md
node bin/ai-ready-score.js ./examples/good-project
node bin/ai-ready-score.js ./examples/poor-project
node bin/ai-ready-score.js --output report.json
node bin/ai-ready-score.js --help
node bin/ai-ready-score.js --version
npm pack --dry-run
```

Remove generated `report.json` and `report.md` before committing unless they are intentionally needed.
