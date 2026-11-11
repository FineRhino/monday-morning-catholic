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

## Adding a printable

Each printable has two files: the original, which Astro turns into small web images for the page, and a print-quality JPEG that visitors download.

1. Put the original in `src/assets/printables/`, for example `thomas-aquinas.png`.
2. Make the print JPEG in `public/printables/`:

   ```sh
   node -e "require('sharp')('src/assets/printables/thomas-aquinas.png').flatten({background:'#fff'}).jpeg({quality:90,mozjpeg:true,chromaSubsampling:'4:4:4'}).toFile('public/printables/thomas-aquinas.jpg').then(i=>console.log(Math.round(i.size/1024)+' KB'))"
   ```

3. Add it to that Doctor in `src/data/doctors.json`:

   ```json
   "printable": {
     "image": "../assets/printables/thomas-aquinas.png",
     "download": "/printables/thomas-aquinas.jpg",
     "alt": "One-page printable on St. Thomas Aquinas, covering ..."
   }
   ```

For sharp prints, originals should be about 2550 × 3300 pixels (letter size at 300 DPI). A PDF also works as the download.

## Content and licensing

- The Catechism and most modern Bible translations (NABRE, RSV-2CE) are copyrighted. Link to them or quote briefly.
- Douay-Rheims Scripture and traditional prayers are public domain.

## Deploying

Any static host works. On Cloudflare Pages or Netlify, use build command `npm run build` and output directory `dist`. Set `site` in `astro.config.mjs` to the real domain.

## Accounts (Supabase)

Visitors can use the site without an account; their prayer list, saved prayers, passages, and daily rhythm stay in the browser. Signing in with an emailed code keeps the same data in [Supabase](https://supabase.com) so it follows them to any device. On first sign-in, anything saved in that browser is copied into the account.

- `supabase/schema.sql` creates the tables, the row level security rules (each person sees only their own rows), and the function behind "Delete my account".
- `src/lib/store.svelte.ts` keeps the data and writes changes to Supabase when someone is signed in.
- `src/pages/account/` is the sign-in, sign-out, download, and delete page, plus the privacy note.

Without the two `PUBLIC_SUPABASE_*` variables, accounts are switched off and the site works from browser storage alone.

### Setting up Supabase

1. Create a free project at [supabase.com](https://supabase.com). Pick a US East region.
2. In **SQL Editor**, paste all of `supabase/schema.sql` and run it.
3. In **Authentication > Emails**, edit the **Magic Link** and **Confirm signup** templates so they include the code, for example `<p>Your sign-in code: {{ .Token }}</p>`, alongside the existing link.
4. In **Authentication > URL Configuration**, set **Site URL** to `https://mondaymorningcatholic.com`. Under **Redirect URLs**, add `https://mondaymorningcatholic.com/**` and `http://localhost:4321/**`.
5. In **Project Settings > API Keys**, copy the project URL and the **publishable** key (never the secret key). Add them to `.env` for local development:

   ```
   PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

6. Add the same two variables in Cloudflare: **Workers & Pages** > `monday-morning-catholic` > **Settings** > **Build** > **Variables and secrets**. They must be build variables, because Astro builds them into the page, so redeploy after any change.

Sign-in emails go through [Resend](https://resend.com), sending from `mondaymorningcatholic.com`. In Supabase, **Authentication > Emails > SMTP Settings** uses host `smtp.resend.com`, port `465`, username `resend`, and a Resend API key as the password. Supabase's built-in sender is for testing only, and custom templates require a custom sender.

## Daily Mass readings

`scripts/daily-readings.ts` adds the day's readings to the home page. It:

1. Reads the [USCCB daily readings RSS feed](https://bible.usccb.org/readings.rss). USCCB posts each day around 4:30 a.m. Eastern, so the script retries every 10 minutes for up to 2 hours.
2. Asks Claude (Opus 5.5) for a one- or two-sentence summary.
3. Saves `src/data/readings/YYYY-MM-DD.json` with the day's name, citations, summary, and a link to USCCB.
4. Runs `npm run build`. If the build fails, it deletes the file and stops.
5. Commits the file and pushes to `main`, which deploys the site.

The reading text is copyrighted (NABRE and the *Lectionary for Mass*), so it is sent to Claude to summarize but never saved or published.

The script won't commit unless the repo is on `main` with no uncommitted changes. Each run logs to `logs/daily-readings.log`, which git ignores.

```sh
npm run readings -- --dry-run             # show what it would save; no Claude call, no files, no git
npm run readings -- --no-git              # summarize, save, and build, but don't commit or push
npm run readings                          # the full run
npm run readings -- --date 2026-11-07     # another day still in the feed (about the last 10 days)
npm run readings -- --force               # replace that day's file
```

### Setting up the bot

The bot runs from its own clone, so a 4 a.m. commit never mixes with work in progress.

1. Clone the repo and install packages:

   ```sh
   git clone https://github.com/FineRhino/monday-morning-catholic.git C:\Users\dilau\projects\mmc-readings-bot
   cd C:\Users\dilau\projects\mmc-readings-bot
   npm install
   ```

2. Create an API key at [platform.claude.com](https://platform.claude.com) and save it in a `.env` file in the clone. Git ignores this file.

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

3. Test it with `npm run readings -- --no-git`, then delete the file it created in `src/data/readings/`.
4. Schedule it from PowerShell. Task Scheduler uses the PC's clock, so if the PC is on Eastern time, 4:00 a.m. adjusts for daylight saving time.

   ```powershell
   $repo = 'C:\Users\dilau\projects\mmc-readings-bot'
   $action = New-ScheduledTaskAction -Execute 'C:\Program Files\nodejs\node.exe' -Argument '--env-file-if-exists=.env scripts/daily-readings.ts' -WorkingDirectory $repo
   $trigger = New-ScheduledTaskTrigger -Daily -At 4:00AM
   $settings = New-ScheduledTaskSettingsSet -WakeToRun -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 3)
   Register-ScheduledTask -TaskName 'Monday Morning Catholic readings' -Action $action -Trigger $trigger -Settings $settings
   ```

The task runs as you, so it pushes with the Git credentials you already use. It only runs while you're signed in to Windows, though a locked or sleeping PC is fine. To run it once by hand, use `Start-ScheduledTask 'Monday Morning Catholic readings'`.

## Next steps

- Search with Pagefind
- RSS feed and a newsletter
- Interactive infographics (D3 or Observable Plot) and animated timelines
- Optional sign-in and sync for personal data (Supabase)
