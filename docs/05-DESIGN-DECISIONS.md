# Design Decisions

## Entry template
### DD-000: Title
- Date:
- Decision:
- Context:
- Options considered:
- Trade-offs:
- Serves and how we'd know:
- Docs updated:

### DD-001: Sprint 0 ships checks, not a visual system
- Date: 2026-10-13
- Decision: One static page in `site/`, built by copying that folder to `dist/`. No framework and no web font. The only visible text is "Ajith Kumar" and "In progress". `site/tokens.css` holds structural placeholders. The type scale and the page grid stay unset until they are ratio-based. CI on every pull request runs the build, the Nu Html Checker, axe-core and a homepage transfer budget of 204800 bytes from `budget.config.json`.
- Context: Sprint 0 is the foundation. The open proposal in docs/01-PROJECT.md is that accessibility and performance belong in every sprint. The owner asked the scaffold to stay visually neutral.
- Options considered:
  1. Static HTML and CSS, with Node used only to build and check.
  2. A static-site generator.
  3. A finished type scale and palette in the token file.
- Trade-offs: No generator. A second page is another HTML file. A generator can wait for a content model. The design system doc is empty. It has no component model to host. The font stack is `ui-sans-serif, system-ui, sans-serif`. Color roles use `Canvas`, `CanvasText` and `GrayText`. Light and dark follow the operating system. That is not a measured palette. Heading sizes stay with the user agent. The file declares the border role. The page does not apply it. axe violations fail the job. The job prints incomplete results. Incomplete results do not fail the job. The check covers 320px and 1280px in light and in dark. The check fails if the page overflows. The check fails if the visible text changes. The budget counts uncompressed bytes of the document and same-origin files. An external URL fails. A root-absolute URL fails. That failure keeps the Pages project path working. The Nu checker runs as a local jar on files. The job does not start it as a server.
- Serves and how we'd know: Maintain, because the checks are commands and the limit lives in config. Understand, because a reader cannot treat the page as a case study. We'd know when `npm run check` passes and the visible text is still the name and "In progress".
- Docs updated: this file, docs/06-BACKLOG.md, docs/07-RELEASE-NOTES.md.

### DD-002: Review in a browser without a new secret
- Date: 2026-10-13
- Decision: A push to `main` deploys `dist/` with GitHub Actions (`actions/upload-pages-artifact` and `actions/deploy-pages`). The only token is the Actions `GITHUB_TOKEN`. A pull request uploads `dist/` as the `site-preview` artifact and uploads `preview/northstar-preview.html` as one file, with the CSS inlined. `npm run preview` serves `dist/` locally.
- Context: The owner reviews in the browser. The Pages API for this repository returns 404. The owner has not enabled Pages yet. `deploy-pages` has a pull-request preview flag that GitHub marks as alpha. The public cannot use it. The workflow leaves that flag off.
- Options considered:
  1. GitHub Pages from `main`, plus artifacts on pull requests.
  2. The alpha Pages preview flag.
  3. A Netlify step, a Vercel step or a Cloudflare Pages step in Actions.
- Trade-offs: Pages gives one URL for `main`, not one URL per pull request. The project URL is https://ajithkv26.github.io/project-northstar/. Stylesheet links are relative so the `/project-northstar/` base path works. The single-file artifact is a review copy. Pages publishes `dist/`, which is what CI checks. A host's GitHub app can comment a preview URL on a pull request. A workflow that called the host with a token would fail until that secret existed. Actions does not call those hosts.
- Serves and how we'd know: Understand, because a reviewer can open the page. Maintain, because publishing uses the same `npm run check` build. The pull request summary links the artifact. The Pages URL serves this page after the owner sets the source to GitHub Actions.
- Docs updated: this file, docs/06-BACKLOG.md, docs/07-RELEASE-NOTES.md.

#### Turn on Pages
1. Settings, Pages, Build and deployment.
2. Set Source to GitHub Actions.
3. Merge to `main`. `.github/workflows/pages.yml` publishes `dist/`.

#### Per-PR URL
Connect one host's GitHub app to `ajithkv26/project-northstar`. Do not add a token to this repository.

| Host | Where | Build command | Output | Install |
|---|---|---|---|---|
| Cloudflare Pages | Workers & Pages, Create, Pages, Connect to Git. Production branch `main`. Framework preset None. | `npm ci && npm run build` | `dist` | The build command installs. |
| Netlify | Add new site, Import an existing project, GitHub. No environment variables. | `npm ci && npm run build` | `dist` (publish directory) | The build command installs. |
| Vercel | Add New, Project, import this repository. Framework preset Other. No environment variables. | `npm run build` | `dist` | Install command `npm ci`. |

Each app comments the preview URL on the pull request. Connecting more than one adds more than one comment.

### DD-003: The homepage uses the supplied copy, asks included
- Date: 2026-10-14
- Decision: `site/index.html` is the homepage. The visible words are the supplied intro, two stories, the thinking section and the background. Each `[ASK: ...]` is a `<mark>` with a dashed hairline in `--north-border`. The gap stays on the page. The build copies root `tokens.css` and `fonts/` into `dist/` with the page. The build removes `site/tokens.css`. The specimen at the repository root stays the reading test.
- Context: Foundations landed in pull request 2. The scaffold page still said "In progress".
- Options considered:
  1. Show the ask text in the layout.
  2. Hide the asks until the sentences exist.
  3. Write the missing sentences.
- Trade-offs: The page stays unfinished on purpose. Hiding an ask would make a gap look like a finished paragraph. Writing the sentences would put words in Ajith's mouth. The mark's thickness is 1px, the hairline from foundations DD-013, because border width is not a token. Headings stay at weight 400, from foundations DD-001, because the file has one roman.
- Serves and how we'd know: Understand, because the structure and the missing sentences are both readable. Maintain, because the page uses the foundation tokens. The check compares the visible text with this copy. That comparison passes.
- Docs updated: this file, docs/06-BACKLOG.md, docs/07-RELEASE-NOTES.md.

### DD-004: Pull requests lint prose
- Date: 2026-10-14
- Decision: Pull requests run Vale 3.24.0. A sentence may use 25 words. A be-verb plus a participle is passive voice. A semicolon marks two ideas. A comma before a coordinating conjunction marks two ideas. Banned words live in `.vale/styles/Northstar/Banned.yml`. Files in `docs/` fail the job. UI labels fail the job. Homepage story copy warns only.
- Context: ASD-STE100 asks for short active sentences. ASD-STE100 asks for one idea in a sentence. The published word list stays out of this repo. The publisher holds that copyright. These checks are local heuristics.
- Options considered:
  1. Local Vale rules and one word list.
  2. A vendored STE dictionary.
  3. A third-party style package.
- Trade-offs: The passive check misses a participle after extra words. The passive check flags some adjectives that end in ed. The one-idea check misses a bare and. Warnings leave the homepage voice alone. The job skips script tags. The job skips style tags. The job skips pre tags. The job skips code.
- Serves: maintain. How we'd know: the prose job lists each finding. The job fails only on errors.
- Docs updated: this file, docs/06-BACKLOG.md, docs/07-RELEASE-NOTES.md.

### DD-005: The homepage uses the STE rewrite
- Date: 2026-10-14
- Decision: The visible words in `site/index.html` are the STE rewrite. Each `[ASK: ...]` stays a `<mark>` with the dashed hairline. I added no other sentences.
- Context: The first homepage used an earlier draft of the same stories.
- Options considered:
  1. Replace the sentences with the STE draft.
  2. Keep the first draft.
  3. Fill the asks.
- Trade-offs: The asks stay open. The check compares the visible text with this draft.
- Serves: understand. How we'd know: the page says what the draft says. The check passes.
- Docs updated: this file, docs/06-BACKLOG.md, docs/07-RELEASE-NOTES.md.

### DD-006: The homepage follows the v0.2 structure
- Date: 2026-10-14
- Decision: The page follows the v0.2 draft. A sticky nav links to Work, Thinking, Stories and Notes. The intro has a title, a lead and one link to the stories. The stories name Gelato, Dell and CEMIT. A notice list, a principle and a footer follow. Sentences stay short and active. Each open `[ASK: ...]` stays a dashed mark.
- Context: Ajith supplied a v0.2 layout. It used Inter, a purple accent, a pill and a tall hero. This page keeps the structure and uses the foundation tokens.
- Options considered:
  1. Keep the v0.2 structure with foundation tokens.
  2. Keep the earlier single column.
  3. Ship the draft CSS.
- Trade-offs: The nav stays visible on a narrow screen. I removed story links with no target. Asks stay on the page as marks.
- Serves: understand. How we'd know: the check passes. The nav links open real sections.
- Docs updated: this file, docs/06-BACKLOG.md, docs/07-RELEASE-NOTES.md.

### DD-007: The check waits for Chrome on an explicit port
- Date: 2026-10-15
- Decision: The check starts Chrome with an explicit debugging port. It reads stdout and stderr. It waits 20 seconds and retries once. It drops the runner D-Bus address.
- Context: After pull request 5, GitHub's Chrome 155 did not open a DevTools port within 10 seconds. The script diff in that pull request is empty. The only Chrome log was a D-Bus address it could not parse. A later run on Chrome 154 failed the same way with an empty log.
- Options considered:
  1. Wait longer on an explicit port and retry once.
  2. Switch the check to a bundled browser.
- Trade-offs: The check can take longer on a slow runner. It still uses the runner's Chrome.
- Serves: maintain. How we'd know: the build and check job passes on this branch.
- Docs updated: this file and docs/07-RELEASE-NOTES.md.
