# monday-morning-catholic

Catholic theology and practice from a lay perspective: why believe in a skeptical world, how to explain the faith, and how to live it out Monday to Friday.

Built with [Astro](https://astro.build), MDX, and Svelte islands.

## Getting started

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then builds to dist/
npm run preview
```

Drafts (`draft: true`) appear in `npm run dev` but are left out of production builds.

## How it's organized

| Path | What it holds |
| --- | --- |
| `src/content/articles/` | Articles as MDX. The frontmatter sets the section, related Doctors, and Catechism paragraphs. |
| `src/data/doctors.json` | The 38 Doctors of the Church, loaded as a typed content collection. |
| `src/data/sections.ts` | Site sections (Believe, Explain, Live, Practices, Notes) and the planned topics taken from the book outline. |
| `src/data/prayers.ts`, `verses.ts` | Prayer texts and verses of the day (Douay-Rheims, public domain). |
| `src/lib/store.svelte.ts` | Local-first personal data (prayer list, saved prayers and passages, daily rhythm) kept in `localStorage`. |
| `src/components/` | Interactive Svelte islands: dashboard widgets, the Doctors timeline, and `<Scripture>` for saveable verses in articles. |
| `src/pages/` | Routes: dashboard home, section pages, articles, teachers, about. |

## Writing an article

Create `src/content/articles/my-article.mdx`:

```mdx
---
title: Peace in the Chaos
description: One sentence for cards and search results.
section: live          # believe | explain | live | practices | notes
date: 2026-11-10
doctors: [francis-de-sales, therese-of-lisieux]   # ids from doctors.json
ccc: [2830]
draft: true
---
import Scripture from '../../components/Scripture.svelte';

<Scripture client:visible ref="Philippians 4:6" text="Be nothing solicitous; ..." />
```

A misspelled Doctor id or a Catechism number outside 1–2865 fails the build.

## Content and licensing

- The Catechism and most modern Bible translations (NABRE, RSV-2CE) are copyrighted. Link to them or quote briefly.
- Douay-Rheims Scripture and traditional prayers are public domain.

## Deploying

Any static host works. On Cloudflare Pages or Netlify, use build command `npm run build` and output directory `dist`. Set `site` in `astro.config.mjs` to the real domain.

## Next steps

- Search with Pagefind
- RSS feed and a newsletter
- Interactive infographics (D3 or Observable Plot) and animated timelines
- Optional sign-in and sync for personal data (Supabase)
