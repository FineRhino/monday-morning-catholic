/**
 * Daily Mass readings bot.
 *
 * Fetches today's readings from the USCCB RSS feed, asks Claude for a one- or two-sentence summary,
 * saves src/data/readings/YYYY-MM-DD.json, builds the site, then commits and pushes to main.
 *
 *   npm run readings                          full run: fetch, summarize, build, commit, push
 *   npm run readings -- --no-git              write the file and build, but skip every git step
 *   npm run readings -- --dry-run             print what was parsed; no Claude call, no files, no git
 *   npm run readings -- --date 2026-11-07     a different day (the feed holds about the last 10 days)
 *   npm run readings -- --force               replace that day's file if it already exists
 *
 * Only the day's name, the citations, a link, and Claude's own summary are published. The reading
 * text (NABRE / Lectionary for Mass) is copyrighted, so it is sent to Claude but never saved.
 * Needs ANTHROPIC_API_KEY, which `npm run readings` loads from a .env file in the repo root.
 */
import Anthropic from '@anthropic-ai/sdk';
import { execFileSync, execSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const READINGS_DIR = path.join(ROOT, 'src', 'data', 'readings');
const LOG_FILE = path.join(ROOT, 'logs', 'daily-readings.log');
const FEED_URL = 'https://bible.usccb.org/readings.rss';
const USER_AGENT = 'MondayMorningCatholic-readings/1.0 (+https://mondaymorningcatholic.com)';
const MODEL = 'claude-opus-5-5';
// USCCB posts each day's readings around 4:30 a.m. Eastern, so an early start waits for them.
const RETRY_EVERY_MIN = 10;
const GIVE_UP_AFTER_MIN = 120;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const NO_GIT = DRY_RUN || args.includes('--no-git');
const FORCE = args.includes('--force');
const dateArg = args.includes('--date') ? args[args.indexOf('--date') + 1] : undefined;

interface FeedItem { title: string; link: string; html: string; }
interface Reading { label: string; citation: string; alt?: string; text: string; }

function log(message: string): void {
  const line = `${new Date().toISOString()} ${message}`;
  console.log(line);
  try {
    mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    appendFileSync(LOG_FILE, line + '\n');
  } catch { /* logging must never stop the run */ }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Today's date in Eastern time, as YYYY-MM-DD. */
function easternToday(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

// ---------- Feed parsing ----------

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…',
};

/** Decodes one level of HTML entities. */
function decode(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, e: string) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? match;
  });
}

/** HTML fragment to plain text, keeping line breaks. */
function toText(html: string): string {
  const text = decode(html.replace(/<br\s*\/?>|<\/p>/gi, '\n').replace(/<[^>]+>/g, ''));
  return text.split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
}

const oneLine = (html: string) => toText(html).replace(/\s+/g, ' ').trim();

function tagContent(body: string, name: string): string {
  return body.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1] ?? '';
}

function parseFeed(xml: string): FeedItem[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, body]) => ({
    title: oneLine(decode(tagContent(body, 'title'))),
    link: tagContent(body, 'link').trim(),
    // The description is escaped HTML; decoding once gives the HTML itself.
    html: decode(tagContent(body, 'description')),
  }));
}

/** Finds the item for a date. Links look like .../readings/110826.cfm (some feast days add a suffix). */
function pickItem(items: FeedItem[], date: string): FeedItem | undefined {
  const [y, m, d] = date.split('-');
  const code = `${m}${d}${y.slice(2)}`;
  const matches = items.filter((i) => new RegExp(`/readings/${code}([-_][^/]*)?\\.cfm$`, 'i').test(i.link));
  return matches.find((i) => i.link.toLowerCase().endsWith(`/${code}.cfm`)) ?? matches[0];
}

function normalizeLabel(label: string): string {
  return label.replace(/:$/, '').replace(/^Reading II$/i, 'Reading 2').replace(/^Reading I$/i, 'Reading 1');
}

/** Splits an item into readings. Each starts with <h4>Label <a href="...">Citation</a></h4>. */
function parseReadings(html: string): Reading[] {
  const readings: Reading[] = [];
  for (const [, head, body] of html.matchAll(/<h4>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4>|$)/g)) {
    const label = normalizeLabel(oneLine(head.replace(/<a[\s\S]*?<\/a>/i, '')));
    const citation = oneLine(head.match(/<a[^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? '');
    const text = toText(body);
    const previous = readings[readings.length - 1];
    if (/^or$/i.test(label) && previous) {
      // An optional alternative to the reading before it, often a shorter form.
      previous.alt = citation;
    } else {
      readings.push({ label, citation, text });
    }
  }
  return readings;
}

async function fetchFeed(): Promise<FeedItem[]> {
  const res = await fetch(FEED_URL, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml' } });
  if (!res.ok) throw new Error(`Feed returned HTTP ${res.status}`);
  const xml = await res.text();
  if (!xml.includes('<rss')) throw new Error('Feed returned something other than RSS (possibly a bot check page)');
  return parseFeed(xml);
}

/** Waits for the day's readings to appear, retrying on network errors too. */
async function findReadings(date: string, wait: boolean): Promise<FeedItem> {
  const deadline = Date.now() + (wait ? GIVE_UP_AFTER_MIN * 60_000 : 0);
  for (;;) {
    let reason: string;
    try {
      const item = pickItem(await fetchFeed(), date);
      if (item) return item;
      reason = `Readings for ${date} are not in the feed yet`;
    } catch (err) {
      reason = `Could not read the feed: ${(err as Error).message}`;
    }
    if (Date.now() >= deadline) throw new Error(reason);
    log(`${reason}. Trying again in ${RETRY_EVERY_MIN} minutes.`);
    await sleep(RETRY_EVERY_MIN * 60_000);
  }
}

// ---------- Summary ----------

const SYSTEM = `You write the "readings of the day" note for Monday Morning Catholic, a website about the Catholic faith for lay readers.
Given the day's Mass readings, write one or two sentences (under 60 words in total) saying what the readings are about and how they connect.
Use your own words. Do not quote the readings beyond a phrase of a few words.
Keep the tone warm and plain, and stay faithful to Catholic teaching.
Reply with only the sentences: no heading, no preamble, no quotation marks, no markdown.`;

async function summarize(title: string, readings: Reading[]): Promise<string> {
  const client = new Anthropic();
  const body = readings.map((r) => `## ${r.label}: ${r.citation}\n${r.text}`).join('\n\n');
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: 'low' },
    // If Claude declines for a safety reason, the API reruns the request on a fallback model.
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: SYSTEM,
    messages: [{ role: 'user', content: `Today is the ${title}.\n\n${body}` }],
  });
  if (response.stop_reason === 'refusal') throw new Error('Claude declined to summarize the readings');
  if (response.stop_reason === 'max_tokens') throw new Error('Claude ran out of tokens before finishing the summary');
  const summary = response.content
    .flatMap((b) => (b.type === 'text' ? [b.text] : []))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (summary.length < 20 || summary.length > 600) throw new Error(`Summary has an unexpected length (${summary.length} characters): ${summary}`);
  return summary;
}

// ---------- Git and build ----------

const git = (...a: string[]) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();

/** Makes sure the repo is safe for an unattended commit, then brings it up to date. */
function prepareRepo(): void {
  const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
  if (branch !== 'main') throw new Error(`Repo is on "${branch}", not main. Not committing.`);
  const dirty = git('status', '--porcelain');
  if (dirty) throw new Error(`Repo has uncommitted changes. Not committing:\n${dirty}`);
  git('pull', '--ff-only', 'origin', 'main');
}

function build(): void {
  try {
    // npm is a .cmd file on Windows, so it needs a shell.
    execSync('npm run build', { cwd: ROOT, encoding: 'utf8', stdio: 'pipe', maxBuffer: 50 * 1024 * 1024 });
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string };
    const output = `${e.stdout ?? ''}\n${e.stderr ?? ''}`.trim().split('\n').slice(-25).join('\n');
    throw new Error(`Build failed:\n${output}`);
  }
}

// ---------- Main ----------

async function main(): Promise<void> {
  const date = dateArg ?? easternToday();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`--date must look like 2026-11-08, got "${date}"`);
  const file = path.join(READINGS_DIR, `${date}.json`);
  log(`Starting readings for ${date}${DRY_RUN ? ' (dry run)' : NO_GIT ? ' (no git)' : ''}`);

  if (!NO_GIT) prepareRepo();
  if (existsSync(file) && !FORCE && !DRY_RUN) {
    log(`${path.relative(ROOT, file)} already exists. Nothing to do.`);
    return;
  }

  // Only wait for the feed on a normal scheduled run.
  const item = await findReadings(date, !dateArg && !DRY_RUN);
  const readings = parseReadings(item.html);
  if (!readings.some((r) => /gospel/i.test(r.label) && r.citation)) {
    throw new Error(`Could not find a Gospel in "${item.title}". The feed format may have changed.`);
  }
  const listed = readings.filter((r) => r.citation).map(({ label, citation, alt }) => (alt ? { label, citation, alt } : { label, citation }));

  if (DRY_RUN) {
    console.log(JSON.stringify({ date, title: item.title, url: item.link, readings: listed }, null, 2));
    log(`Dry run parsed ${readings.length} readings (${readings.reduce((n, r) => n + r.text.length, 0)} characters of text).`);
    return;
  }

  const summary = await summarize(item.title, readings);
  const entry = { date, title: item.title, url: item.link, readings: listed, summary };
  mkdirSync(READINGS_DIR, { recursive: true });
  writeFileSync(file, JSON.stringify(entry, null, 2) + '\n');
  log(`Wrote ${path.relative(ROOT, file)}: ${summary}`);

  try {
    build();
  } catch (err) {
    rmSync(file);
    throw err;
  }
  log('Build passed.');

  if (NO_GIT) return;
  git('add', '--', file);
  git('commit', '-m', `Daily readings for ${date}: ${item.title}`);
  // Pick up anything pushed since the earlier pull, then push.
  git('pull', '--rebase', 'origin', 'main');
  git('push', 'origin', 'main');
  log(`Pushed readings for ${date}.`);
}

main().catch((err: unknown) => {
  log(`FAILED: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
