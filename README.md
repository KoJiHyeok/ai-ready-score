# ai-ready-score

[![CI](https://github.com/KoJiHyeok/ai-ready-score/actions/workflows/ci.yml/badge.svg)](https://github.com/KoJiHyeok/ai-ready-score/actions/workflows/ci.yml)

## Overview

`ai-ready-score` is a Node.js CLI that analyzes a local project folder and scores how ready the codebase is for AI coding agents such as Codex, Claude Code, Cursor, and Antigravity.

It answers one practical question: is this codebase easy for an AI coding agent to understand, run, modify, and test?

## Why this exists

AI coding agents work best when a repository has clear documentation, predictable structure, runnable scripts, test instructions, and safe project defaults. This tool gives maintainers a quick, local readiness check before asking an agent to make changes.

## Features

- Scores a local folder from 0 to 100.
- Assigns a grade from A to F.
- Reports category breakdowns, passed checks, failed checks, warnings, and recommended next steps.
- Supports Korean human-readable terminal output by default.
- Supports English human-readable terminal output with `--lang en`.
- Supports machine-readable JSON output.
- Can write a JSON report to disk.
- Uses only Node.js built-in modules.
- Runs on Node.js 18 or newer.

## Installation

Clone the repository and run the CLI with Node.js:

```sh
git clone <repository-url>
cd ai-ready-score
npm test
node bin/ai-ready-score.js .
```

You can also link it locally while developing:

```sh
npm link
ai-ready-score .
```

## Usage

```sh
node bin/ai-ready-score.js
node bin/ai-ready-score.js .
node bin/ai-ready-score.js ./examples/good-project
node bin/ai-ready-score.js ./examples/poor-project
node bin/ai-ready-score.js . --lang ko
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js --json
node bin/ai-ready-score.js --output report.json
node bin/ai-ready-score.js --help
node bin/ai-ready-score.js --version
```

Options:

- `--json`: print valid JSON.
- `--output <file>`: write a JSON report to a file.
- `--lang <ko|en>`: set the human-readable output language. The default is `ko`.
- `--help`: show usage help.
- `--version`: show the package version.

## Example Output

```text
ai-ready-score

대상 경로: /path/to/project
총점: 90/100
등급: A

카테고리별 점수:
- 문서화: 25/25
- 프로젝트 구조: 17/20
- package.json 스크립트: 20/20
- AI 작업 친화성: 20/20
- GitHub 및 보안 준비도: 8/15
```

## Scoring Rubric

Total score: 100 points.

Documentation: 25 points

- README.md exists: 8
- README explains project purpose: 4
- README has installation instructions: 4
- README has usage instructions: 5
- README explains project structure: 4

Project Structure: 20 points

- src/ exists: 6
- tests/ or test/ exists: 5
- docs/ exists: 3
- examples/ exists: 3
- scripts/ or bin/ exists: 3

Package Scripts: 20 points

- package.json exists: 5
- scripts.dev exists: 4
- scripts.start exists: 3
- scripts.test exists: 5
- scripts.build or scripts.check exists: 3

AI Readiness: 20 points

- AGENTS.md exists: 8
- AGENTS.md includes project overview: 3
- AGENTS.md includes run instructions: 3
- AGENTS.md includes test instructions: 3
- AGENTS.md includes coding rules: 3

GitHub & Safety Readiness: 15 points

- .gitignore exists: 4
- .env.example exists: 4
- LICENSE exists: 3
- CONTRIBUTING.md exists: 2
- no obvious sensitive root files: 2

Grades:

- 90-100: A
- 80-89: B
- 70-79: C
- 60-69: D
- 0-59: F

Sensitive root files create warnings:

- `.env`
- `.env.local`
- `.env.production`
- `id_rsa`
- `id_dsa`
- any file ending in `.pem`
- any file ending in `.key`

## Project Structure

```text
ai-ready-score/
|-- bin/
|   `-- ai-ready-score.js
|-- src/
|   |-- index.js
|   |-- cli.js
|   |-- scanner.js
|   |-- rules.js
|   |-- scorer.js
|   |-- reporter.js
|   |-- i18n.js
|   `-- utils.js
|-- tests/
|   |-- scorer.test.js
|   |-- scanner.test.js
|   `-- cli.test.js
|-- examples/
|   |-- good-project/
|   `-- poor-project/
|-- README.md
|-- AGENTS.md
|-- package.json
|-- .gitignore
|-- LICENSE
`-- .env.example
```

## Development

This is a Node.js 18+ CLI written in JavaScript with CommonJS modules. It intentionally uses only Node.js built-in modules.

Useful commands:

```sh
npm test
npm run dev
npm start
npm run check
```

Keep the implementation split by responsibility:

- `src/scanner.js` reads project files and folders.
- `src/rules.js` defines the scoring rubric.
- `src/scorer.js` calculates scores and grades.
- `src/reporter.js` formats terminal and JSON output.
- `src/i18n.js` stores translated labels and messages for human-readable output.
- `src/cli.js` parses options and connects the pieces.

## Testing

Tests use the built-in `node:test` runner:

```sh
npm test
```

The suite covers grade calculation, score bounds, scanner behavior, invalid `package.json` handling, CLI help, Korean and English text output, JSON output, and scanning both example projects.

## Quality Checks

GitHub Actions runs the CI workflow on every push and pull request. The workflow tests Node.js 18 and Node.js 20, runs `npm test`, and validates the CLI against the repository plus both example projects.

## Roadmap

- Add more repository health checks.
- Add optional configuration for custom rubrics.
- Add CI examples.
- Add richer documentation checks.

## Limitations

- The tool scans only the project root for the MVP.
- Documentation checks use keyword matching.
- It does not inspect source code quality or test coverage.
- It does not make network requests or call AI APIs.

## Contributing

Contributions should keep the CLI simple, cross-platform, and dependency-free. Update tests and documentation whenever scoring behavior changes.

## License

MIT
