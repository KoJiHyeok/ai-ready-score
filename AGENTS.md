# AGENTS.md

## Project Overview

`ai-ready-score` is a dependency-free Node.js CLI that scores whether a local project is easy for AI coding agents to understand, run, modify, and test.

- Runtime: Node.js 18 or newer.
- Language: JavaScript.
- Module system: CommonJS with `require` and `module.exports`.
- Dependencies: Node.js built-in modules only.
- Do not add AI API calls, network requests, or external npm dependencies.

## Repository Map

```text
bin/                  CLI executable entry point
src/                  implementation modules
tests/                node:test test suite
examples/             sample projects used for validation
docs/                 release notes and supporting docs
README.md             user-facing documentation
AGENTS.md             instructions for AI coding agents
```

## Core Architecture

Keep responsibilities separate:

- `src/scanner.js`: detects root files, folders, package metadata, and warnings.
- `src/rules.js`: defines scoring rules and categories.
- `src/scorer.js`: calculates scores, grades, checks, and recommendations.
- `src/reporter.js`: formats text, JSON, and Markdown output.
- `src/i18n.js`: stores Korean and English user-facing messages.
- `src/initializer.js`: handles `--init` file/folder creation.
- `src/templates.js`: stores `--init` starter templates.
- `src/cli.js`: parses options and coordinates scan, score, init, reporting, output, and exit codes.

## Supported CLI Behavior

Preserve these public behaviors unless the user explicitly asks to change them:

- Default human-readable output is Korean.
- `--lang ko` and `--lang en` select human-readable output language.
- `--json` prints parseable JSON.
- `--markdown` prints a GitHub-friendly Markdown report.
- `--output <file>` writes JSON or Markdown reports to disk.
- `--init` creates starter files/folders only when missing.
- `--min-score <0-100>` exits `1` when the score is below the threshold.
- `--help` and `--version` must keep working.

## How to Run

```sh
node bin/ai-ready-score.js .
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js . --json
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js --init
node bin/ai-ready-score.js . --min-score 80
```

## Non-Negotiable Rules

- Keep CommonJS.
- Do not add dependencies.
- Use Node.js built-in modules only.
- Use `path` for filesystem paths.
- Preserve Windows, macOS, and Linux compatibility.
- Preserve Korean and English output.
- Preserve JSON and Markdown output stability.
- Preserve `--init` no-overwrite behavior.
- Preserve `--min-score` exit codes.
- Update tests when behavior changes.
- Update README.md, CHANGELOG.md, AGENTS.md, and release notes when user-facing behavior changes.
- Keep English and Korean documentation consistent for user-facing behavior. 짧은 한국어 메모는 유용할 때만 유지합니다.

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

Do not change scoring rules without updating tests, README.md, AGENTS.md, and example projects so documented behavior matches implementation.

## Files to Read First

- `README.md`
- `src/cli.js`
- `src/rules.js`
- `src/scorer.js`
- `src/scanner.js`
- `src/reporter.js`
- `src/i18n.js`
- `tests/*.test.js`

## Common Tasks

- CLI option changes usually touch `src/cli.js`, `src/reporter.js`, `src/i18n.js`, and `tests/cli.test.js`.
- Scoring changes usually touch `src/rules.js`, `src/scorer.js`, tests, README.md, and examples.
- `--init` template changes usually touch `src/templates.js`, initializer tests, README.md, and AGENTS.md.
- Release work usually touches `package.json`, CHANGELOG.md, release checklist, and release notes.

## Common Validation Commands

Use this compact validation set for normal development, expanding it when the change affects a specific behavior:

```sh
npm test
npm run check
node bin/ai-ready-score.js .
node bin/ai-ready-score.js . --lang ko
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js . --json
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js . --min-score 80
node bin/ai-ready-score.js --help
node bin/ai-ready-score.js --version
```

## Normal Development Workflow

For every normal development task:

1. Understand the requested change.
2. Implement the change.
3. Update tests.
4. Update docs if user-facing behavior changed.
5. Run `npm test`.
6. Run `npm run check`.
7. Run relevant CLI smoke tests from the common validation block.
8. Clean generated artifacts.
9. Run `git status --short`.
10. Commit with a clear message.
11. Push to `origin main`.
12. Summarize changed files, validation, commit hash, and push result.

Do not stop after editing code. If validation fails, fix the issue and rerun validation before committing.

## Release Workflow

Use this only when the user explicitly says the task is a release or publish task:

1. Confirm the requested release version.
2. Bump `package.json`.
3. Update README.md, CHANGELOG.md, AGENTS.md, `docs/release-checklist.md`, and `docs/release-notes/` as needed.
4. Run full validation.
5. Run `npm pack --dry-run`.
6. Inspect package contents for safety.
7. Commit release changes.
8. Tag `vX.Y.Z`.
9. Push `main` and the tag.
10. Run `npm publish --access public`.
11. Verify with `npx ai-ready-score@latest --version`.
12. Prepare bilingual GitHub Release notes.
13. Summarize publish result.

Never run `npm publish` unless the user explicitly requests release or publish work. Never create git tags unless the task is a release task. Never claim deployment or npm publication succeeded unless the command actually succeeded. If publish fails, report the exact error and do not mark the release complete.

## Release Validation Commands

```sh
npm run check
npm pack --dry-run
npm publish --access public
npx ai-ready-score@latest --version
```

## Cleanup Rules

Do not commit generated or local-only artifacts:

- `report.json`
- `report.md`
- `init-report.json`
- `*.tgz`
- `node_modules/`
- `.env`
- `.env.local`
- npm debug logs

## Do Not Do

- Do not publish without explicit user approval.
- Do not tag unless this is a release task.
- Do not overwrite user files with `--init`.
- Do not add external npm dependencies.
- Do not add AI API calls.
- Do not add network requests.
- Do not change scoring rules without tests and documentation.
- Do not leave English/Korean docs inconsistent when user-facing behavior changes.
- Do not combine scanner, scorer, reporter, initializer, templates, and CLI logic into one file.
- Do not rely on shell-specific path separators.
