# Wingdoku public support site

Public source repository: https://github.com/medmemara/wingdoku-support

## Deployment

Cloudflare Pages uses this Git repository's `main` branch. Build command: `node build.cjs`. Output directory: `dist`. No environment secrets are needed. A push to `main` starts a production deployment once the Git integration is connected.

`deployment.json` contains the deployed source commit and document versions. Compare this with the Git commit and Cloudflare deployment status before reporting a change as live.

The old GitHub Pages site is retained for links in earlier app versions. Do not remove the old privacy or account deletion paths.

## Editing

1. Update the Korean and English pages together.
2. Update dates, document versions, and `CHANGELOG.md` when policy content changes.
3. Run `node build.cjs` and check all local links.
4. Commit and push `main`; verify the build and public pages.
5. Sync the same source files to the private game's `public-support/` directory.

Only the files listed in `build.cjs` are published to Cloudflare. Do not put credentials, user records, or account tokens in this repository.
