# ysw.kr

Seungwon Yang's personal academic website, built with Docusaurus 3.4,
React, TypeScript, and Tailwind CSS. Docs and blog are disabled; routes live in
`src/pages/`. Production: https://ysw.kr/

Read [AGENTS.md](AGENTS.md) before editing for the agreed content, design,
links, mobile, and CV conventions.

## Development

Use npm and the committed `package-lock.json`. Node.js >= 18 is required by
`package.json`.

```sh
npm ci
npm start -- --no-open --host 127.0.0.1
npm run typecheck
npm run check:tools
npm run build
npm run serve
```

`npm run build` runs the tool registry check automatically and outputs the
static site to `build/`. `npm run clear` clears Docusaurus-generated caches.

## File map

| Content | Location |
| --- | --- |
| Homepage and academic service | `src/pages/index.tsx` |
| Publications shared by home and listing | `src/data/publications.ts` |
| Project entries and categories | `src/pages/misc.tsx` |
| Tool registry | `src/data/tools.ts` |
| Tool directory and individual pages | `src/pages/tools.tsx`, `src/pages/tools/` |
| Shared tool layout | `src/components/ToolLayout.tsx` |
| Internal/external website links | `src/components/SiteLink.tsx` |
| Plain page styles | `src/components/PlainPage.module.css` |
| Homepage styles | `src/components/Homepage.module.css` |
| Project styles | `src/pages/misc.module.css` |
| Theme variables and legacy global styles | `src/css/custom.css`, `tailwind.config.js` |
| Site metadata and navigation | `docusaurus.config.ts` |
| Deployed CV | `static/cv.pdf` |
| Editable CV source for Overleaf | `output/pdf/CV_seungwon_yang_updated.zip` |
| Publication thumbnails / app icons | `static/img/pub/`, `static/img/projects/` |

`@/` resolves to `src/` in TypeScript and Webpack. Shared UI primitives live
in `src/components/ui/`; reuse them for interactive tools when appropriate.
Old global card/animation styles are not the design default for new pages.

## Managing tools

Tool names, descriptions, categories, routes, and search tags live in
`src/data/tools.ts`. The directory and individual page headings use this
registry. `pageTitle` and `pageDescription` are optional overrides for localized
page copy; omit them to use the directory name and description.

1. Add an entry to `toolDefinitions`, using a unique ID and `/tools/<id>` route.
2. Create `src/pages/tools/<id>.tsx` and wrap its content in
   `<ToolLayout toolId="<id>">...</ToolLayout>`.
3. Run `npm run check:tools` and `npm run typecheck`.

The registry check detects missing/unregistered pages, duplicate IDs/routes,
unknown categories, and mismatched layout IDs.

## CV

Extract the tracked source ZIP to a working directory, edit the LaTeX/BibLaTeX
files, and compile from that directory:

```sh
latexmk -pdf -interaction=nonstopmode -halt-on-error -outdir=build cv.tex
pdftoppm -png build/cv.pdf build/preview
```

Inspect all rendered pages before replacing `static/cv.pdf`. Repack the edited
sources into the tracked ZIP, excluding generated build files. Preserve the
existing automatic publication numbering. Rebuild the website after replacing
the PDF so the deployment contains the same version.

## Deployment

GitHub Pages serves the root of `gh-pages` at `https://ysw.kr/`.
Source changes belong on `main`.

1. Check the working diff and remote state; run the checks and production build.
2. Commit and push the requested source changes to `main`.
3. In a separate temporary checkout of `gh-pages`, replace the generated site
   with `build/`, preserving `.git`, `CNAME`, and `.nojekyll`.
4. Commit the generated output with the source commit ID and push normally.
5. Verify the GitHub Pages build and live pages, including `/cv.pdf`.

The existing `npm run deploy` command invokes Docusaurus's deployment helper;
it requires `GIT_USER` or `USE_SSH=true` and force-pushes `gh-pages`.
Prefer the separate-checkout workflow above to preserve remote history.
