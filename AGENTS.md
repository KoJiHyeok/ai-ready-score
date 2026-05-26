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
- `src/initializer.js` should create missing starter files and folders for `--init`.
- `src/templates.js` should store starter file templates used by `--init`.
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
node bin/ai-ready-score.js . --min-score 80
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

The package is published on npm, so public usage examples may include:

```sh
npx ai-ready-score .
npx ai-ready-score . --lang en
npx ai-ready-score . --min-score 80
npx ai-ready-score . --json
npx ai-ready-score . --markdown
npm install -g ai-ready-score
ai-ready-score .
```

`ai-ready-score`는 npm에서 사용할 수 있으므로 README와 릴리스 노트의 설치 예시는 실제 npm 사용법을 기준으로 작성해야 합니다.

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

- README.md, release notes, and release documentation are bilingual in English and Korean.
- When user-facing behavior changes, update both English and Korean documentation in the same change.
- Do not leave Korean docs outdated when English docs change.
- Do not leave English docs outdated when Korean docs change.
- Keep CHANGELOG.md, docs/release-checklist.md, and docs/release-notes/* aligned for release-related changes.

## Required Completion Workflow

Future agents must not stop after editing code. A task is complete only after implementation, tests, validation, cleanup, commit, push, and a concise final summary are done.

### Normal Development Tasks

For every normal development task:

1. Understand the requested change.
2. Implement the change.
3. Update tests.
4. Update documentation if user-facing behavior changed.
5. Run:

```sh
npm test
npm run check
node bin/ai-ready-score.js .
node bin/ai-ready-score.js . --lang ko
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js . --json
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js --help
node bin/ai-ready-score.js --version
```

6. Clean generated artifacts before committing:

- `report.json`
- `report.md`
- `init-report.json`
- `*.tgz`
- `node_modules/`
- `.env`
- `.env.local`
- npm debug logs

7. Run:

```sh
git status --short
```

8. Commit changes with a clear commit message.
9. Push to `origin main`.
10. Summarize changed files, validation results, commit hash, and push result.

If any validation fails, fix the issue and rerun validation before committing. Future agents must preserve Korean/English output, JSON output, Markdown output, `--init` behavior, and `--min-score` behavior unless the user explicitly asks to change them.

### Release Tasks Only

Only follow this release workflow when the user explicitly says the task is a release or publish task:

1. Confirm the requested release version.
2. Bump `package.json` version.
3. Run full validation.
4. Run:

```sh
npm pack --dry-run
```

5. Confirm package contents are safe.
6. Commit release changes.
7. Create the git tag:

```sh
git tag vX.Y.Z
```

8. Push:

```sh
git push origin main
git push origin vX.Y.Z
```

9. Publish:

```sh
npm publish --access public
```

10. Verify:

```sh
npx ai-ready-score@latest --version
```

11. Update or prepare bilingual GitHub Release notes.
12. Summarize the npm publish result.

Do not run `npm publish` unless the user explicitly requests release or publish work. Do not create git tags unless the task is a release task. Do not claim deployment or npm publication succeeded unless the command actually succeeded. If `npm publish` fails, report the exact error and do not mark the release complete.

## 작업 완료 워크플로우

향후 에이전트는 코드 편집 후 바로 멈추면 안 됩니다. 구현, 테스트, 검증, 정리, 커밋, push, 최종 요약까지 끝나야 작업이 완료된 것입니다.

### 일반 개발 작업

모든 일반 개발 작업에서는 다음 순서를 따릅니다.

1. 요청된 변경 사항을 이해합니다.
2. 변경 사항을 구현합니다.
3. 테스트를 업데이트합니다.
4. 사용자에게 보이는 동작이 바뀌면 문서를 업데이트합니다.
5. 다음 명령을 실행합니다.

```sh
npm test
npm run check
node bin/ai-ready-score.js .
node bin/ai-ready-score.js . --lang ko
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js . --json
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js --help
node bin/ai-ready-score.js --version
```

6. 커밋하기 전에 생성된 산출물을 정리합니다.

- `report.json`
- `report.md`
- `init-report.json`
- `*.tgz`
- `node_modules/`
- `.env`
- `.env.local`
- npm debug logs

7. 다음 명령을 실행합니다.

```sh
git status --short
```

8. 명확한 커밋 메시지로 변경 사항을 커밋합니다.
9. `origin main`으로 push합니다.
10. 변경 파일, 검증 결과, 커밋 해시, push 결과를 요약합니다.

검증이 실패하면 문제를 수정하고 검증을 다시 실행한 뒤 커밋해야 합니다. 향후 에이전트는 사용자가 명시적으로 요청하지 않는 한 한국어/영어 출력, JSON 출력, Markdown 출력, `--init` 동작, `--min-score` 동작을 보존해야 합니다.

### 릴리스 작업 전용

사용자가 명시적으로 릴리스 또는 publish 작업이라고 말한 경우에만 다음 릴리스 워크플로우를 따릅니다.

1. 요청된 릴리스 버전을 확인합니다.
2. `package.json` 버전을 올립니다.
3. 전체 검증을 실행합니다.
4. 다음 명령을 실행합니다.

```sh
npm pack --dry-run
```

5. 패키지 포함 파일이 안전한지 확인합니다.
6. 릴리스 변경 사항을 커밋합니다.
7. git 태그를 만듭니다.

```sh
git tag vX.Y.Z
```

8. push합니다.

```sh
git push origin main
git push origin vX.Y.Z
```

9. publish합니다.

```sh
npm publish --access public
```

10. 검증합니다.

```sh
npx ai-ready-score@latest --version
```

11. bilingual GitHub Release notes를 업데이트하거나 준비합니다.
12. npm publish 결과를 요약합니다.

사용자가 명시적으로 release 또는 publish를 요청하지 않으면 `npm publish`를 실행하지 않습니다. 릴리스 작업이 아니면 git tag를 만들지 않습니다. 실제 명령이 성공하지 않았는데 배포나 npm publish가 성공했다고 말하면 안 됩니다. `npm publish`가 실패하면 정확한 오류를 보고하고 릴리스를 완료로 표시하지 않습니다.

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
- Change `--init` templates in `src/templates.js`.
- Update README.md and this file when behavior changes.

## Initializer Behavior

- `--init` must never overwrite existing user files or folders.
- Existing files and folders must be reported as skipped.
- Keep initializer logic separate from scanner and scorer logic.
- When changing starter templates, update tests that verify generated files and user-facing init output.
- Keep `--init --json` parseable and keep `--init --markdown` stable enough for saved reports.

## Threshold Behavior

- `--min-score <0-100>` should analyze the project normally and then compare the score against the threshold.
- If the score is greater than or equal to the threshold, exit with code 0.
- If the score is lower than the threshold, print the report and exit with code 1.
- `--min-score` must work with Korean, English, JSON, and Markdown output.
- `--min-score` must not be combinable with `--init`.
- Future agents must preserve these CI-friendly exit codes when changing CLI flow.

## Do Not Do

- Do not add external npm dependencies.
- Do not add AI API calls.
- Do not add network requests.
- Do not publish a new npm version without explicit user approval.
- Do not change version numbers casually; version changes should match an intentional release plan.
- Do not combine scanner, scorer, reporter, and CLI logic into one file.
- Do not change scoring rules without updating tests.
- Do not make `--init` overwrite user files.
- Do not break `--min-score` exit codes.
- Do not rely on shell-specific path separators.

## npm Publishing Checklist

Before preparing a new npm release:

- Confirm `package.json` has correct `name`, `version`, `description`, `main`, `bin`, `keywords`, `license`, `repository`, `bugs`, `homepage`, and `files`.
- Confirm `bin.ai-ready-score` points to `bin/ai-ready-score.js`.
- Confirm `bin/ai-ready-score.js` keeps the `#!/usr/bin/env node` shebang.
- Run `npm run check`.
- Run `npm pack --dry-run` and inspect the packed file list.
- Confirm generated reports such as `report.json` and `report.md` are not included unless intentionally needed.
- Get explicit user approval before running `npm publish` for any future release.

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
- Publish any future npm version only after explicit user approval.

## Before Submitting Changes

Run:

```sh
npm test
node bin/ai-ready-score.js
node bin/ai-ready-score.js .
node bin/ai-ready-score.js . --lang ko
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js . --min-score 80
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
