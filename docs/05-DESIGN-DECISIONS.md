# Design Decisions

## Entry template
### DD-000: Title
- Date:
- Decision:
- Context:
- Options considered:
- Trade-offs:
- Serves (understand / maintain / memorable), and how we'd know:
- Docs updated:

### DD-001: Sprint 0 ships checks, not a visual system
- Date: 2026-10-13
- Decision: One static page in `site/`, built by copying that folder to `dist/`. No framework and no web font. The only visible text is "Ajith Kumar" and "In progress". `site/tokens.css` holds structural placeholders. The type scale and the page grid stay unset until they are ratio-based. CI on every pull request runs the build, the Nu Html Checker, axe-core, and a homepage transfer budget of 204800 bytes from `budget.config.json`.
- Context: Sprint 0 is the foundation. The open proposal in docs/01-PROJECT.md is that accessibility and performance belong in every sprint. The owner asked the scaffold to stay visually neutral.
- Options considered:
  1. Static HTML and CSS, with Node used only to build and check.
  2. A static-site generator.
  3. A finished type scale and palette in the token file.
- Trade-offs: No generator. A second page is another HTML file, or a generator added when a content model exists. The design system doc is empty, so there is no component model to host. The font stack is `ui-sans-serif, system-ui, sans-serif`. Color roles use `Canvas`, `CanvasText`, and `GrayText`, so light and dark follow the operating system. That is not a measured palette. Heading sizes stay with the user agent. The border role is declared and not applied. axe violations fail the job. Incomplete results are printed and do not fail the job. The check covers 320px and 1280px, light and dark, and fails if the page overflows or the visible text changes. The budget counts uncompressed bytes of the document and same-origin files. An external or root-absolute URL fails, which also keeps the Pages project path working. The Nu checker runs as a local jar on files. It is not started as a server.
- Serves (understand / maintain / memorable), and how we'd know: Maintain, because the checks are commands and the limit lives in config. Understand, because the page cannot be read as a case study. We'd know when `npm run check` passes and the visible text is still the name and "In progress".
- Docs updated: this file, docs/06-BACKLOG.md, docs/07-RELEASE-NOTES.md.

### DD-002: Review in a browser without a new secret
- Date: 2026-10-13
- Decision: A push to `main` deploys `dist/` with GitHub Actions (`actions/upload-pages-artifact` and `actions/deploy-pages`). The only token is the Actions `GITHUB_TOKEN`. A pull request uploads `dist/` as the `site-preview` artifact and uploads `preview/northstar-preview.html` as one file, with the CSS inlined. `npm run preview` serves `dist/` locally.
- Context: The owner reviews in the browser. The Pages API for this repository returns 404, so Pages is not enabled yet. `deploy-pages` has a pull-request preview flag that GitHub marks as alpha and not available to the public. It is not turned on.
- Options considered:
  1. GitHub Pages from `main`, plus artifacts on pull requests.
  2. The alpha Pages preview flag.
  3. A Netlify, Vercel, or Cloudflare Pages step in Actions.
- Trade-offs: Pages gives one URL for `main`, not one URL per pull request. The project URL is https://ajithkv26.github.io/project-northstar/. Stylesheet links are relative so the `/project-northstar/` base path works. The single-file artifact is a review copy. Pages publishes `dist/`, which is what CI checks. A host's GitHub app can comment a preview URL on a pull request. A workflow that called the host with a token would fail until that secret existed, so Actions does not call those hosts.
- Serves (understand / maintain / memorable), and how we'd know: Understand, because a reviewer can open the page. Maintain, because publishing uses the same `npm run check` build. We'd know when the pull request summary links the artifact, and when the Pages URL serves this page after the source is set to GitHub Actions.
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
