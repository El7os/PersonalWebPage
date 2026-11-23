# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (runs `next dev --webpack`, i.e. webpack rather than Turbopack)
- `npm run build` — production build (also the only type/MDX compile check)
- `npm run lint` — ESLint (`eslint-config-next` core-web-vitals + typescript)
- `npm run kill` — Windows-only helper that kills whatever is holding port 3000

There is no test suite.

## Architecture

Personal portfolio + technical blog (Unreal Engine / rendering topics). Next.js 16 App Router, React 19, TypeScript, Tailwind 4 (imported in `globals.css` but most styling is inline `style={{}}` objects plus a few global classes). Path alias `@/*` → `src/*`.

### Blog posts are hand-wired MDX
Each post lives in `src/app/blog/<slug>/` as two files:
- `content.mdx` — the article body.
- `page.tsx` — exports `metadata` and renders `<BlogLayout><article className="blog-content">…<Content/></article></BlogLayout>`.

There is no filesystem-driven post index: `src/app/blog/page.tsx` holds a hardcoded `posts` array (slug, title, date, excerpt, readTime) that must be updated manually when adding a post. The home page's featured cards are also hardcoded.

Post assets (images, SVG diagrams) go in `public/blog/<slug>/` and are referenced by absolute path, e.g. `/blog/<slug>/Image_Foo.svg`.

### Deployment and the base path
The site is published to GitHub Pages by `.github/workflows/deploy-pages.yml` on every push to `main`. `next.config.ts` uses `output: 'export'` (static files in `out/`), `trailingSlash: true` and `images.unoptimized`, and takes `basePath` from the `PAGES_BASE_PATH` env var (`/PersonalWebPage` on a project page, empty locally or with a custom domain).

`next/link` adds the base path by itself; nothing else does. Every other absolute URL — plain `<a href>`, CSS `url(...)`, `next/image` `src` — must go through `withBasePath()` from `src/lib/basePath.ts`. In MDX, use `<Img src="/blog/..." alt="..." />`, never a literal `<img>`: MDX does not route literal JSX tags through the component registry, so they would miss the prefix. `BeforeAfter`, `GameGif` and `GameVideo` prefix their own sources.

To test a production build locally on Windows, set `MSYS_NO_PATHCONV=1` in Git Bash, otherwise `PAGES_BASE_PATH=/PersonalWebPage` is rewritten into a Windows path.

### MDX component registry
`src/mdx-components.tsx` injects components into every MDX file globally, so MDX uses them without imports: `CodeBlock`, `CodeInline`, `MathBlock`, `MathInline`, `Notification`, `BeforeAfter`, `GameGif`, `GameVideo`, `Table`, `Img`. A new MDX component must be registered there.

Conventions in MDX content:
- Code: `<CodeBlock code={\`...\`} filename="..." />` — code is passed as a template literal prop, so backslashes must be doubled (`\\`) and backticks escaped. `CodeBlock` has its own C++ tokenizer (used for HLSL too); the `language` prop only changes the header label.
- Inline identifiers: `<CodeInline>Name</CodeInline>`.
- Math: `$...$` inline works via `remark-math`/`rehype-katex` (configured in `next.config.ts`); display equations use `<MathBlock latex="..." caption="..." />` which renders KaTeX server-side.
- Callouts: `<Notification emoji="U+1F4A1">…</Notification>` (emoji accepts a glyph or code point).

### Blog layout / TOC
`BlogLayout` (client) renders `TableOfContents`, a fixed left panel that scrapes `h1`–`h6` from the first `<article>` in the DOM after mount, assigns `toc-heading-N` ids, and scroll-spies with an IntersectionObserver. Heading structure in the MDX directly drives the TOC.

### Global chrome and theme
`src/app/layout.tsx` wraps everything in `Navigation`, which renders the fixed 70px top nav, `<main>` (with 70px top padding), and the footer. Layout offsets elsewhere (TOC `top: 70px`, scroll offset) assume that 70px height.

Dark theme tokens are CSS variables in `src/app/globals.css` (`--accent-color: #00ffcc`, `--glass-*`, etc.), along with `.glass-panel`, `.btn*`, `.heading-*`, and `.blog-content` typography rules.
