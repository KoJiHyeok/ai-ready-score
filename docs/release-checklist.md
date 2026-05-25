# Release Checklist

Use this checklist before publishing a public release.

## v0.1.0

1. Confirm `package.json` version is `0.1.0`.
2. Confirm README describes what the tool does, why AI readiness matters, installation, usage, output formats, scoring, and limitations.
3. Confirm `CHANGELOG.md` has a `v0.1.0` entry.
4. Run `npm test`.
5. Run `npm run check`.
6. Run `npm pack --dry-run` and inspect the packed file list.
7. Run `git status --short` and confirm only intended files changed.
8. Commit the release preparation changes.
9. Create the tag with `git tag v0.1.0`.
10. Push the branch with `git push origin main`.
11. Push the tag with `git push origin v0.1.0`.
12. Draft the GitHub release notes from `CHANGELOG.md`.
13. Run `npm publish` only after explicit user approval.

Do not publish to npm or create a GitHub release automatically without explicit user approval.
