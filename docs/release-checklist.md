# Release Checklist

Use this checklist before publishing a public release.

공개 릴리스를 배포하기 전에 이 체크리스트를 사용하세요.

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
