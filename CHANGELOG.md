# Changelog

All notable changes to this project will be documented in this file.

모든 주요 변경 사항은 이 파일에 기록합니다.

## v0.4.0

### English

Release workflow documentation update.

- Added a required completion workflow to `AGENTS.md` so future Codex work runs validation, cleans artifacts, commits, and pushes after normal development tasks.
- Added a release-only workflow that separates ordinary code changes from tag creation and npm publishing.
- Documented that `npm publish` must run only when the user explicitly requests a release or publish task.
- Reinforced preservation requirements for Korean/English output, JSON output, Markdown output, `--init`, and `--min-score`.

### 한국어

릴리스 워크플로우 문서를 업데이트했습니다.

- 향후 Codex 작업이 일반 개발 작업 후 검증, 산출물 정리, 커밋, push까지 수행하도록 `AGENTS.md`에 필수 완료 워크플로우를 추가했습니다.
- 일반 코드 변경과 태그 생성 및 npm 배포를 분리하는 릴리스 전용 워크플로우를 추가했습니다.
- 사용자가 명시적으로 release 또는 publish 작업을 요청한 경우에만 `npm publish`를 실행해야 한다고 문서화했습니다.
- 한국어/영어 출력, JSON 출력, Markdown 출력, `--init`, `--min-score` 보존 요구사항을 강화했습니다.

## v0.3.0

### English

CI score threshold release.

- Added `--min-score` to fail CI-friendly commands when the project score is below a required threshold.
- Added threshold messages for Korean, English, JSON, and Markdown output.
- Added validation for invalid threshold values and for the unsupported `--init --min-score` combination.

### 한국어

CI 점수 기준 릴리스입니다.

- 프로젝트 점수가 필요한 기준보다 낮을 때 CI 친화적인 명령을 실패시키는 `--min-score`를 추가했습니다.
- 한국어, 영어, JSON, Markdown 출력에 점수 기준 메시지를 추가했습니다.
- 잘못된 점수 기준 값과 지원하지 않는 `--init --min-score` 조합 검증을 추가했습니다.

## v0.1.0

### English

Initial public MVP release preparation.

- Added the initial dependency-free Node.js CLI for scoring local codebases for AI coding agent readiness.
- Added the 100-point scoring rubric across documentation, project structure, package scripts, AI readiness, and GitHub/safety readiness.
- Added Korean human-readable output by default.
- Added English human-readable output with `--lang en`.
- Added stable machine-readable JSON output with `--json`.
- Added GitHub-friendly Markdown report output with `--markdown`.
- Added output file writing with `--output`.
- Added AGENTS.md support checks for AI coding agents.
- Added sensitive root file warnings.
- Added example good and poor projects.
- Added GitHub Actions CI for Node.js 18, Node.js 20, and Node.js 22.
- `ai-ready-score` is now available on npm.
- Added npm package metadata, package file allowlist, and prepublish validation.

### 한국어

첫 공개 MVP 릴리스를 준비했습니다.

- AI 코딩 에이전트 작업 준비도를 점수화하는 의존성 없는 Node.js CLI를 추가했습니다.
- 문서화, 프로젝트 구조, package.json 스크립트, AI 작업 친화성, GitHub 및 보안 준비도를 기준으로 한 100점 점수 체계를 추가했습니다.
- 기본 한국어 human-readable 출력을 추가했습니다.
- `--lang en`을 통한 영어 human-readable 출력을 추가했습니다.
- `--json`을 통한 안정적인 기계 판독용 JSON 출력을 추가했습니다.
- `--markdown`을 통한 GitHub 친화적 Markdown 리포트 출력을 추가했습니다.
- `--output`을 통한 리포트 파일 저장 기능을 추가했습니다.
- AI 코딩 에이전트를 위한 AGENTS.md 지원 점검을 추가했습니다.
- 프로젝트 루트의 민감 파일 경고를 추가했습니다.
- 좋은 예시 프로젝트와 부족한 예시 프로젝트를 추가했습니다.
- Node.js 18, Node.js 20, Node.js 22에서 실행되는 GitHub Actions CI를 추가했습니다.
- `ai-ready-score`는 이제 npm에서 사용할 수 있습니다.
- npm 패키지 메타데이터, 패키지 파일 allowlist, prepublish 검증을 추가했습니다.
