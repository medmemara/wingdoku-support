# Wingdoku public support site

Public source repository: https://github.com/medmemara/wingdoku-support

Production site: https://wingdoku.pages.dev/

## Deployment

Cloudflare Pages uses this Git repository's `main` branch. Build command: `node build.cjs`. Output directory: `dist`. No environment secrets are needed. A push to `main` starts a production deployment once the Git integration is connected.

`deployment.json` contains the deployed source commit and document versions. Compare this with the Git commit and Cloudflare deployment status before reporting a change as live.

The old GitHub Pages site is retained for links in earlier app versions. Its HTML pages redirect visitors to the matching `wingdoku.pages.dev` page. Without JavaScript, the same policy text remains readable. Do not remove the old privacy or account deletion paths.

## Editing

1. Update the Korean and English pages together.
2. Update dates, document versions, and `CHANGELOG.md` when policy content changes.
3. Run `node build.cjs` and check all local links.
4. Commit and push `main`; verify the build and public pages.
5. Sync the same source files to the private game's `public-support/` directory.

Only the files listed in `build.cjs` are published to Cloudflare. Do not put credentials, user records, or account tokens in this repository.

## 다국어 검색 페이지

`discovery.json`이 7개 언어의 제품·문의 원고 원본이다. `node build.cjs`가 `discovery-build.cjs`로 언어별 HTML, sitemap.xml, robots.txt, 404.html을 만든다. 기존 정책 HTML과 app-ads.txt는 유지한다. 게임 안의 언어는 133개이며 웹 소개 언어 수와 구분한다.

Google 소유권 확인용 `google*.html`과 공개 IndexNow 증명 파일 `indexnow.txt`는 배포 후에도 유지한다. 이 파일들은 비밀 인증 정보가 아니다. 출시 상태가 바뀌면 `discovery.json`의 상태와 각 언어의 안내를 함께 고친다.
