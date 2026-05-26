# Release Checklist

Use this checklist before publishing a public release.

공개 릴리스를 배포하기 전에 이 체크리스트를 사용하세요.

## v0.5.0

### English

1. Confirm `package.json` version is `0.5.0`.
2. Confirm `--config` is documented in README.md and AGENTS.md.
3. Confirm `CHANGELOG.md` has a bilingual `v0.5.0` entry.
4. Confirm `docs/release-notes/v0.5.0.md` is ready for the GitHub Release body.
5. Run `npm test`.
6. Run `npm run check`.
7. Run focused `--config` smoke tests for JSON, Markdown, Korean, English, and failure exit codes.
8. Run `npm pack --dry-run` and inspect the packed file list.
9. Commit the release preparation changes.
10. Create the tag with `git tag v0.5.0`.
11. Push the branch with `git push origin main`.
12. Push the tag with `git push origin v0.5.0`.
13. Run `npm publish --access public` only because this task explicitly requests release and publish.
14. Verify the published package with `npx ai-ready-score@latest --version`.
15. Create the GitHub Release from `docs/release-notes/v0.5.0.md`.

### 한국어

1. `package.json` 버전이 `0.5.0`인지 확인합니다.
2. README.md와 AGENTS.md에 `--config`가 문서화되어 있는지 확인합니다.
3. `CHANGELOG.md`에 bilingual `v0.5.0` 항목이 있는지 확인합니다.
4. `docs/release-notes/v0.5.0.md`가 GitHub Release 본문으로 사용할 준비가 되었는지 확인합니다.
5. `npm test`를 실행합니다.
6. `npm run check`를 실행합니다.
7. JSON, Markdown, 한국어, 영어, 실패 종료 코드에 대한 `--config` 집중 smoke test를 실행합니다.
8. `npm pack --dry-run`을 실행하고 패키지에 포함될 파일 목록을 확인합니다.
9. 릴리스 준비 변경 사항을 커밋합니다.
10. `git tag v0.5.0`으로 태그를 생성합니다.
11. `git push origin main`으로 브랜치를 push합니다.
12. `git push origin v0.5.0`으로 태그를 push합니다.
13. 이 작업이 명시적으로 release 및 publish를 요청했으므로 `npm publish --access public`을 실행합니다.
14. `npx ai-ready-score@latest --version`으로 배포된 패키지를 검증합니다.
15. `docs/release-notes/v0.5.0.md`를 사용해 GitHub Release를 생성합니다.

## v0.4.1

### English

1. Confirm `package.json` version is `0.4.1`.
2. Confirm `package.json.files` includes `AGENTS.md`.
3. Confirm README is current for npm usage, `--init`, `--min-score`, JSON, Markdown, and bilingual output.
4. Confirm `CHANGELOG.md` has a bilingual `v0.4.1` entry.
5. Confirm `docs/release-notes/v0.4.1.md` is ready for the GitHub Release body.
6. Run `npm test`.
7. Run `npm run check`.
8. Run `npm pack --dry-run` and confirm `AGENTS.md` is included.
9. Commit the release preparation changes.
10. Create the tag with `git tag v0.4.1`.
11. Push the branch with `git push origin main`.
12. Push the tag with `git push origin v0.4.1`.
13. Run `npm publish --access public` only because this task explicitly requests release and publish.
14. Verify the published package with `npx ai-ready-score@latest --version`.

### 한국어

1. `package.json` 버전이 `0.4.1`인지 확인합니다.
2. `package.json.files`에 `AGENTS.md`가 포함되어 있는지 확인합니다.
3. README가 npm 사용법, `--init`, `--min-score`, JSON, Markdown, bilingual 출력 기준으로 최신 상태인지 확인합니다.
4. `CHANGELOG.md`에 bilingual `v0.4.1` 항목이 있는지 확인합니다.
5. `docs/release-notes/v0.4.1.md`가 GitHub Release 본문으로 사용할 준비가 되었는지 확인합니다.
6. `npm test`를 실행합니다.
7. `npm run check`를 실행합니다.
8. `npm pack --dry-run`을 실행하고 `AGENTS.md`가 포함되는지 확인합니다.
9. 릴리스 준비 변경 사항을 커밋합니다.
10. `git tag v0.4.1`으로 태그를 생성합니다.
11. `git push origin main`으로 브랜치를 push합니다.
12. `git push origin v0.4.1`으로 태그를 push합니다.
13. 이 작업이 명시적으로 release 및 publish를 요청했으므로 `npm publish --access public`을 실행합니다.
14. `npx ai-ready-score@latest --version`으로 배포된 패키지를 검증합니다.

## v0.4.0

### English

1. Confirm `package.json` version is `0.4.0`.
2. Confirm `CHANGELOG.md` has bilingual `v0.4.0` and `v0.3.0` entries.
3. Confirm `docs/release-notes/v0.4.0.md` is ready for the GitHub Release body.
4. Confirm `AGENTS.md` documents the required completion workflow and release-only publish workflow.
5. Run `npm test`.
6. Run `npm run check`.
7. Run `npm pack --dry-run` and inspect the packed file list.
8. Run `git status --short` and confirm only intended files changed.
9. Commit the release preparation changes.
10. Create the tag with `git tag v0.4.0`.
11. Push the branch with `git push origin main`.
12. Push the tag with `git push origin v0.4.0`.
13. Run `npm publish --access public` only because this task explicitly requests release and publish.
14. Verify the published package with `npx ai-ready-score@latest --version`.
15. Use `docs/release-notes/v0.4.0.md` as the bilingual GitHub Release note starting point.

### 한국어

1. `package.json` 버전이 `0.4.0`인지 확인합니다.
2. `CHANGELOG.md`에 bilingual `v0.4.0` 및 `v0.3.0` 항목이 있는지 확인합니다.
3. `docs/release-notes/v0.4.0.md`가 GitHub Release 본문으로 사용할 준비가 되었는지 확인합니다.
4. `AGENTS.md`가 필수 완료 워크플로우와 릴리스 전용 publish 워크플로우를 문서화하는지 확인합니다.
5. `npm test`를 실행합니다.
6. `npm run check`를 실행합니다.
7. `npm pack --dry-run`을 실행하고 패키지에 포함될 파일 목록을 확인합니다.
8. `git status --short`를 실행하고 의도한 파일만 변경되었는지 확인합니다.
9. 릴리스 준비 변경 사항을 커밋합니다.
10. `git tag v0.4.0`으로 태그를 생성합니다.
11. `git push origin main`으로 브랜치를 push합니다.
12. `git push origin v0.4.0`으로 태그를 push합니다.
13. 이 작업이 명시적으로 release 및 publish를 요청했으므로 `npm publish --access public`을 실행합니다.
14. `npx ai-ready-score@latest --version`으로 배포된 패키지를 검증합니다.
15. `docs/release-notes/v0.4.0.md`를 bilingual GitHub Release note 시작점으로 사용합니다.

## v0.1.0

### English

1. Confirm `package.json` version is `0.1.0`.
2. Confirm README explains what the tool does, why AI readiness matters, installation, usage, output formats, scoring, limitations, and contribution guidance.
3. Confirm README has both English and Korean sections.
4. Confirm `CHANGELOG.md` has a bilingual `v0.1.0` entry.
5. Confirm `docs/release-notes/v0.1.0.md` is ready for the GitHub Release body.
6. Run `npm test`.
7. Run `npm run check`.
8. Run `npm pack --dry-run` and inspect the packed file list.
9. Run `git status --short` and confirm only intended files changed.
10. Commit the release preparation changes.
11. Create the tag with `git tag v0.1.0`.
12. Push the branch with `git push origin main`.
13. Push the tag with `git push origin v0.1.0`.
14. Create a GitHub Release from the `v0.1.0` tag.
15. Use `docs/release-notes/v0.1.0.md` as the release note starting point.
16. Run `npm publish` only after explicit user approval.

Do not publish to npm or create a GitHub Release automatically without explicit user approval.

### 한국어

1. `package.json` 버전이 `0.1.0`인지 확인합니다.
2. README가 도구의 역할, AI 준비도가 중요한 이유, 설치 방법, 사용 방법, 출력 형식, 점수 기준, 한계, 기여 방법을 설명하는지 확인합니다.
3. README에 영어와 한국어 섹션이 모두 있는지 확인합니다.
4. `CHANGELOG.md`에 bilingual `v0.1.0` 항목이 있는지 확인합니다.
5. `docs/release-notes/v0.1.0.md`가 GitHub Release 본문으로 사용할 준비가 되었는지 확인합니다.
6. `npm test`를 실행합니다.
7. `npm run check`를 실행합니다.
8. `npm pack --dry-run`을 실행하고 패키지에 포함될 파일 목록을 확인합니다.
9. `git status --short`를 실행하고 의도한 파일만 변경되었는지 확인합니다.
10. 릴리스 준비 변경 사항을 커밋합니다.
11. `git tag v0.1.0`으로 태그를 생성합니다.
12. `git push origin main`으로 브랜치를 푸시합니다.
13. `git push origin v0.1.0`으로 태그를 푸시합니다.
14. `v0.1.0` 태그에서 GitHub Release를 생성합니다.
15. `docs/release-notes/v0.1.0.md`를 릴리스 노트 초안으로 사용합니다.
16. 명시적인 사용자 승인 후에만 `npm publish`를 실행합니다.

명시적인 사용자 승인 없이 npm에 배포하거나 GitHub Release를 자동으로 생성하지 마세요.
