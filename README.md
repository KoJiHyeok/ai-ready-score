# ai-ready-score

[![CI](https://github.com/KoJiHyeok/ai-ready-score/actions/workflows/ci.yml/badge.svg)](https://github.com/KoJiHyeok/ai-ready-score/actions/workflows/ci.yml)

## Language

- [English](#english)
- [한국어](#한국어)

---

# English

## Overview

`ai-ready-score` is a dependency-free Node.js CLI that analyzes a local project folder and scores how ready the codebase is for AI coding agents such as Codex, Claude Code, Cursor, and Antigravity.

It answers one practical question: is this codebase easy for an AI coding agent to understand, run, modify, and test?

## Why this exists

AI coding agents work best when a repository has clear documentation, predictable structure, runnable scripts, test instructions, and safe project defaults. This tool gives maintainers a quick local readiness check before asking an agent to make changes.

## Features

- Scores a local folder from 0 to 100.
- Assigns a grade from A to F.
- Reports category breakdowns, passed checks, failed checks, warnings, and recommended next steps.
- Uses Korean for human-readable output by default.
- Supports English human-readable output with `--lang en`.
- Supports machine-readable JSON output with `--json`.
- Supports GitHub-friendly Markdown report output with `--markdown`.
- Can write JSON or Markdown reports to disk with `--output`.
- Can initialize missing AI-readiness starter files and folders with `--init`.
- Warns about obvious sensitive files in the project root.
- Uses only Node.js built-in modules.
- Runs on Node.js 18 or newer.

## Installation

`ai-ready-score` is available on npm.

Run without installing:

```sh
npx ai-ready-score .
npx ai-ready-score --init
npx ai-ready-score ./my-project --init
npx ai-ready-score . --lang en
npx ai-ready-score . --json
npx ai-ready-score . --markdown
```

Install globally:

```sh
npm install -g ai-ready-score
ai-ready-score .
```

For local development, clone the repository and run the CLI with Node.js:

```sh
git clone <repository-url>
cd ai-ready-score
npm test
node bin/ai-ready-score.js .
```

Windows PowerShell uses the same commands:

```powershell
node .\bin\ai-ready-score.js .
node .\bin\ai-ready-score.js . --lang en
node .\bin\ai-ready-score.js . --markdown --output report.md
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
node bin/ai-ready-score.js --init
node bin/ai-ready-score.js ./my-project --init
node bin/ai-ready-score.js ./examples/good-project
node bin/ai-ready-score.js ./examples/poor-project
node bin/ai-ready-score.js . --lang ko
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js . --json
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js . --markdown --lang en
node bin/ai-ready-score.js . --markdown --output report.md
node bin/ai-ready-score.js --output report.json
node bin/ai-ready-score.js --help
node bin/ai-ready-score.js --version
```

Options:

- `--init`: create missing starter AI-readiness files and folders without overwriting existing files.
- `--lang <ko|en>`: set the human-readable output language. The default is `ko`.
- `--json`: print valid JSON for automation.
- `--markdown`: print a Markdown report.
- `--output <file>`: write the report to a file. Defaults to JSON unless `--markdown` is selected.
- `--help`: show usage help.
- `--version`: show the package version.

## Output formats

Human-readable text is the default output format. It is Korean by default:

```sh
node bin/ai-ready-score.js .
node bin/ai-ready-score.js . --lang ko
```

English human-readable output is available with:

```sh
node bin/ai-ready-score.js . --lang en
```

JSON output is intended for scripts, CI, and automation:

```sh
node bin/ai-ready-score.js . --json
node bin/ai-ready-score.js --output report.json
```

Markdown output is intended for GitHub issues, pull requests, release notes, and saved reports:

```sh
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js . --markdown --lang en
node bin/ai-ready-score.js . --markdown --output report.md
```

Only one machine/report output format can be selected at a time. `--json --markdown` returns a friendly error.

## Initialization

Use `--init` to add missing starter files and folders that make a project easier for AI coding agents to understand:

```sh
npx ai-ready-score --init
npx ai-ready-score ./my-project --init
node bin/ai-ready-score.js --init
node bin/ai-ready-score.js ./my-project --init
```

`--init` creates these items only when they are missing:

- `AGENTS.md`
- `.env.example`
- `CONTRIBUTING.md`
- `docs/`
- `docs/README.md` when `docs/` is newly created
- `examples/`
- `examples/README.md` when `examples/` is newly created

Existing files and folders are never overwritten. If an item already exists, the command reports it as skipped. `--init --json` returns a machine-readable initialization result, and `--init --markdown` prints a Markdown initialization report.

## Scoring rubric

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
- No obvious sensitive root files: 2

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

## Example output

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

Markdown output:

```md
# AI-Ready Codebase Report

- **Target:** /path/to/project
- **Score:** 90/100
- **Grade:** A

## Category Breakdown

| Category | Points |
| --- | ---: |
| Documentation | 25/25 |
| Project Structure | 17/20 |
| Package Scripts | 20/20 |
| AI Readiness | 20/20 |
| GitHub & Safety Readiness | 8/15 |
```

## Project structure

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
|-- docs/
|-- README.md
|-- CHANGELOG.md
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
npm pack --dry-run
```

Implementation responsibilities:

- `src/scanner.js` reads project files and folders.
- `src/rules.js` defines the scoring rubric.
- `src/scorer.js` calculates scores and grades.
- `src/reporter.js` formats terminal, Markdown, and JSON output.
- `src/i18n.js` stores translated labels and messages for human-readable and Markdown output.
- `src/cli.js` parses options and connects the pieces.

## Testing

Tests use the built-in `node:test` runner:

```sh
npm test
```

The broader local check runs tests and validates Korean, English, JSON, and Markdown output:

```sh
npm run check
```

GitHub Actions runs CI on push and pull request with Node.js 18, Node.js 20, and Node.js 22.

## Roadmap

- Add more repository health checks.
- Add optional configuration for custom rubrics.
- Add CI usage examples.
- Add richer documentation checks.

## Limitations

- The tool scans only the project root for the MVP.
- Documentation checks use keyword matching.
- It does not inspect source code quality or test coverage.
- It does not make network requests or call AI APIs.
- The npm package is available, but release tags and GitHub Release notes are still maintained manually.

## Contributing

Contributions should keep the CLI simple, cross-platform, dependency-free, and CommonJS-based. Update tests and both English and Korean documentation whenever user-facing behavior changes.

## License

MIT

---

# 한국어

## 개요

`ai-ready-score`는 로컬 프로젝트 폴더를 분석해 코드베이스가 AI 코딩 에이전트가 이해하고, 실행하고, 수정하고, 테스트하기 쉬운 상태인지 점수화하는 Node.js CLI입니다. 외부 npm 의존성 없이 Node.js 기본 모듈만 사용합니다.

이 도구는 “이 저장소가 AI 코딩 에이전트에게 작업하기 좋은 구조인가?”라는 실용적인 질문에 빠르게 답합니다.

## 만든 이유

AI 코딩 에이전트는 문서가 명확하고, 구조가 예측 가능하며, 실행 스크립트와 테스트 방법이 준비되어 있고, 안전한 기본 설정을 가진 저장소에서 더 잘 동작합니다. `ai-ready-score`는 에이전트에게 작업을 맡기기 전에 저장소의 준비 상태를 로컬에서 빠르게 점검할 수 있게 해 줍니다.

## 주요 기능

- 로컬 폴더를 0점부터 100점까지 점수화합니다.
- A부터 F까지 등급을 표시합니다.
- 카테고리별 점수, 통과 항목, 실패 항목, 경고, 추천 작업을 보여 줍니다.
- 사람이 읽는 기본 출력은 한국어입니다.
- `--lang en`으로 영어 출력을 사용할 수 있습니다.
- `--json`으로 자동화에 적합한 JSON을 출력합니다.
- `--markdown`으로 GitHub에 붙여 넣기 좋은 Markdown 리포트를 출력합니다.
- `--output`으로 JSON 또는 Markdown 리포트를 파일로 저장할 수 있습니다.
- `--init`으로 AI 작업 친화성을 높이는 기본 파일과 폴더를 생성할 수 있습니다.
- 프로젝트 루트의 명백한 민감 파일을 경고합니다.
- Node.js 기본 모듈만 사용합니다.
- Node.js 18 이상에서 실행됩니다.

## 설치 방법

`ai-ready-score`는 npm에서 사용할 수 있습니다.

설치 없이 다음처럼 실행할 수 있습니다.

```sh
npx ai-ready-score .
npx ai-ready-score --init
npx ai-ready-score ./my-project --init
npx ai-ready-score . --lang en
npx ai-ready-score . --json
npx ai-ready-score . --markdown
```

전역 설치는 다음처럼 사용할 수 있습니다.

```sh
npm install -g ai-ready-score
ai-ready-score .
```

로컬 개발 환경에서는 저장소를 clone한 뒤 Node.js로 실행합니다.

```sh
git clone <repository-url>
cd ai-ready-score
npm test
node bin/ai-ready-score.js .
```

Windows PowerShell에서도 같은 방식으로 실행할 수 있습니다.

```powershell
node .\bin\ai-ready-score.js .
node .\bin\ai-ready-score.js . --lang en
node .\bin\ai-ready-score.js . --markdown --output report.md
```

개발 중에는 로컬 링크도 사용할 수 있습니다.

```sh
npm link
ai-ready-score .
```

## 사용 방법

```sh
node bin/ai-ready-score.js
node bin/ai-ready-score.js .
node bin/ai-ready-score.js --init
node bin/ai-ready-score.js ./my-project --init
node bin/ai-ready-score.js ./examples/good-project
node bin/ai-ready-score.js ./examples/poor-project
node bin/ai-ready-score.js . --lang ko
node bin/ai-ready-score.js . --lang en
node bin/ai-ready-score.js . --json
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js . --markdown --lang en
node bin/ai-ready-score.js . --markdown --output report.md
node bin/ai-ready-score.js --output report.json
node bin/ai-ready-score.js --help
node bin/ai-ready-score.js --version
```

옵션:

- `--init`: 기존 파일을 덮어쓰지 않고 AI 작업 준비에 필요한 기본 파일과 폴더를 생성합니다.
- `--lang <ko|en>`: 사람이 읽는 출력 언어를 설정합니다. 기본값은 `ko`입니다.
- `--json`: 자동화에 사용할 수 있는 올바른 JSON을 출력합니다.
- `--markdown`: Markdown 리포트를 출력합니다.
- `--output <file>`: 리포트를 파일로 저장합니다. `--markdown`을 선택하지 않으면 기본적으로 JSON을 저장합니다.
- `--help`: 도움말을 표시합니다.
- `--version`: 패키지 버전을 표시합니다.

## 출력 형식

기본 출력은 사람이 읽는 텍스트이며 한국어입니다.

```sh
node bin/ai-ready-score.js .
node bin/ai-ready-score.js . --lang ko
```

영어 출력은 다음처럼 사용할 수 있습니다.

```sh
node bin/ai-ready-score.js . --lang en
```

JSON 출력은 스크립트, CI, 자동화에 적합합니다.

```sh
node bin/ai-ready-score.js . --json
node bin/ai-ready-score.js --output report.json
```

Markdown 출력은 GitHub issue, pull request, release note, 저장용 리포트에 적합합니다.

```sh
node bin/ai-ready-score.js . --markdown
node bin/ai-ready-score.js . --markdown --lang en
node bin/ai-ready-score.js . --markdown --output report.md
```

리포트 출력 형식은 한 번에 하나만 선택할 수 있습니다. `--json --markdown`을 함께 사용하면 친절한 오류 메시지를 출력합니다.

## 초기화

`--init`을 사용하면 AI 코딩 에이전트가 프로젝트를 더 쉽게 이해할 수 있도록 기본 파일과 폴더를 추가할 수 있습니다.

```sh
npx ai-ready-score --init
npx ai-ready-score ./my-project --init
node bin/ai-ready-score.js --init
node bin/ai-ready-score.js ./my-project --init
```

`--init`은 다음 항목이 없을 때만 생성합니다.

- `AGENTS.md`
- `.env.example`
- `CONTRIBUTING.md`
- `docs/`
- `docs/`를 새로 만들 때 `docs/README.md`
- `examples/`
- `examples/`를 새로 만들 때 `examples/README.md`

기존 파일과 폴더는 절대 덮어쓰지 않습니다. 이미 있는 항목은 건너뛴 항목으로 보고합니다. `--init --json`은 자동화에 사용할 수 있는 초기화 결과를 반환하고, `--init --markdown`은 Markdown 초기화 리포트를 출력합니다.

## 점수 기준

총점은 100점입니다.

문서화: 25점

- README.md가 있습니다: 8
- README에 프로젝트 목적이 설명되어 있습니다: 4
- README에 설치 방법이 포함되어 있습니다: 4
- README에 사용 방법이 포함되어 있습니다: 5
- README에 프로젝트 구조 설명이 포함되어 있습니다: 4

프로젝트 구조: 20점

- src/ 폴더가 있습니다: 6
- tests/ 또는 test/ 폴더가 있습니다: 5
- docs/ 폴더가 있습니다: 3
- examples/ 폴더가 있습니다: 3
- scripts/ 또는 bin/ 폴더가 있습니다: 3

package.json 스크립트: 20점

- package.json이 있습니다: 5
- scripts.dev가 있습니다: 4
- scripts.start가 있습니다: 3
- scripts.test가 있습니다: 5
- scripts.build 또는 scripts.check가 있습니다: 3

AI 작업 친화성: 20점

- AGENTS.md가 있습니다: 8
- AGENTS.md에 프로젝트 개요가 포함되어 있습니다: 3
- AGENTS.md에 실행 방법이 포함되어 있습니다: 3
- AGENTS.md에 테스트 방법이 포함되어 있습니다: 3
- AGENTS.md에 코딩 규칙이 포함되어 있습니다: 3

GitHub 및 보안 준비도: 15점

- .gitignore가 있습니다: 4
- .env.example이 있습니다: 4
- LICENSE가 있습니다: 3
- CONTRIBUTING.md가 있습니다: 2
- 루트 폴더에 명백한 민감 파일이 없습니다: 2

등급:

- 90-100: A
- 80-89: B
- 70-79: C
- 60-69: D
- 0-59: F

다음과 같은 루트 파일은 경고를 만듭니다.

- `.env`
- `.env.local`
- `.env.production`
- `id_rsa`
- `id_dsa`
- `.pem`으로 끝나는 파일
- `.key`로 끝나는 파일

## 출력 예시

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

Markdown 출력:

```md
# AI 준비도 분석 리포트

- **검사 대상:** /path/to/project
- **총점:** 90/100
- **등급:** A

## 카테고리별 점수

| 카테고리 | 점수 |
| --- | ---: |
| 문서화 | 25/25 |
| 프로젝트 구조 | 17/20 |
| package.json 스크립트 | 20/20 |
| AI 작업 친화성 | 20/20 |
| GitHub 및 보안 준비도 | 8/15 |
```

## 프로젝트 구조

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
|-- docs/
|-- README.md
|-- CHANGELOG.md
|-- AGENTS.md
|-- package.json
|-- .gitignore
|-- LICENSE
`-- .env.example
```

## 개발 방법

이 프로젝트는 CommonJS 기반 JavaScript로 작성된 Node.js 18+ CLI입니다. 의도적으로 Node.js 기본 모듈만 사용합니다.

자주 사용하는 명령:

```sh
npm test
npm run dev
npm start
npm run check
npm pack --dry-run
```

구현 책임:

- `src/scanner.js`: 프로젝트 파일과 폴더를 읽습니다.
- `src/rules.js`: 점수 기준을 정의합니다.
- `src/scorer.js`: 점수와 등급을 계산합니다.
- `src/reporter.js`: 터미널, Markdown, JSON 출력을 만듭니다.
- `src/i18n.js`: 사람이 읽는 출력과 Markdown 출력의 번역 메시지를 저장합니다.
- `src/cli.js`: CLI 옵션을 파싱하고 전체 흐름을 연결합니다.

## 테스트

테스트는 Node.js 내장 `node:test` 러너를 사용합니다.

```sh
npm test
```

더 넓은 로컬 검증은 테스트와 한국어, 영어, JSON, Markdown 출력을 함께 확인합니다.

```sh
npm run check
```

GitHub Actions는 push와 pull request에서 Node.js 18, Node.js 20, Node.js 22로 CI를 실행합니다.

## 로드맵

- 저장소 상태 점검 항목 추가
- 사용자 정의 점수 기준 설정 추가
- CI 사용 예시 추가
- 더 정교한 문서 점검 추가

## 한계

- MVP에서는 프로젝트 루트만 스캔합니다.
- 문서 점검은 키워드 매칭을 사용합니다.
- 소스 코드 품질이나 테스트 커버리지는 검사하지 않습니다.
- 네트워크 요청이나 AI API 호출을 하지 않습니다.
- npm 패키지는 사용할 수 있지만, 릴리스 태그와 GitHub Release 노트는 수동으로 관리합니다.

## 기여 방법

기여 시 CLI를 단순하고, 크로스 플랫폼이며, 의존성 없고, CommonJS 기반으로 유지해 주세요. 사용자에게 보이는 동작이 바뀌면 테스트와 영어/한국어 문서를 함께 업데이트해야 합니다.

## 라이선스

MIT
