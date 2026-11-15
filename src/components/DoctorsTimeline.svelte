<script lang="ts">
  /**
   * `doctor` false draws a ring instead of a filled dot (other saints and theologians).
   * `featured` (Christ) draws a larger gold dot. `dates` replaces the year where it is uncertain.
   */
  interface Doc { id: string; name: string; died: number; era: string; summary: string; doctor?: boolean; featured?: boolean; dates?: string; }
  let { doctors, initial = 'augustine-of-hippo' }: { doctors: Doc[]; initial?: string } = $props();

  /**
   * The axis has three parts, each with its own scale, so the crowded first century gets room
   * and nineteen centuries of the Old Testament don't push the Church to one side.
   * Figures of Scripture (era0) go in the first two; everyone else in the third.
   */
  const BASE = 150;
  const SEGS = [
    { name: 'Old Testament', from: -1900, to: -500, x1: 30, x2: 120, ticks: [-1800, -1600, -1400, -1200, -1000, -800, -600], labels: [-1800, -600] },
    { name: 'New Testament', from: -20, to: 105, x1: 150, x2: 350, ticks: [0, 25, 50, 75, 100], labels: [0, 50, 100] },
    { name: 'The Church', from: 100, to: 2050, x1: 380, x2: 975, ticks: Array.from({ length: 19 }, (_, i) => 200 + i * 100), labels: Array.from({ length: 10 }, (_, i) => 200 + i * 200) },
  ];
  const segOf = (d: Doc) => (d.era !== 'era0' ? SEGS[2] : d.died < -100 ? SEGS[0] : SEGS[1]);
  const at = (s: (typeof SEGS)[number], v: number) => s.x1 + ((v - s.from) / (s.to - s.from)) * (s.x2 - s.x1);
  const yearLabel = (v: number) => (v < 0 ? `${-v} BC` : v === 0 ? 'AD 1' : String(v));
  const when = (d: Doc) => d.dates ?? String(d.died);

  // Stack dots that would overlap.
  const placed = (() => {
    const stack: Record<number, number> = {};
    return doctors.map((d) => {
      const cx = at(segOf(d), d.died);
      const b = Math.round(cx / 14);
      stack[b] = (stack[b] ?? 0) + 1;
      return { ...d, cx, cy: BASE - 14 - (stack[b] - 1) * 16 };
    });
  })();

  let sel = $state(Math.max(0, doctors.findIndex((d) => d.id === initial)));
  const cur = $derived(placed[sel]);
  const step = (n: number) => (sel = (sel + n + placed.length) % placed.length);
  const hasOthers = doctors.some((d) => d.doctor === false);
  const hasScripture = doctors.some((d) => d.era === 'era0');
  const hasFeatured = doctors.some((d) => d.featured);
  const segs = $derived(hasScripture ? SEGS : SEGS.slice(2));
</script>

<div class="box">
  <svg class="chart" viewBox="0 0 1000 205" role="group" aria-label="Timeline of teachers of the faith, from the Old Testament to today">
    {#each segs as s (s.name)}
      <line x1={s.x1} x2={s.x2} y1={BASE} y2={BASE} style="stroke: var(--ink)" stroke-width="1.2" />
      {#each s.ticks as t}
        <line x1={at(s, t)} x2={at(s, t)} y1={BASE} y2={BASE + 6} style="stroke: var(--muted)" />
      {/each}
      {#each s.labels as t}
        <text x={at(s, t)} y={BASE + 22} text-anchor="middle" style="fill: var(--muted)">{yearLabel(t)}</text>
      {/each}
      {#if hasScripture}
        <text class="seg" x={(s.x1 + s.x2) / 2} y={BASE + 44} text-anchor="middle" style="fill: var(--{s.name === 'The Church' ? 'muted' : 'era0'})">{s.name}</text>
      {/if}
    {/each}
    {#if hasScripture}
      <!-- Breaks in the axis between the parts, which use different scales. -->
      {#each [135, 365] as bx}
        <line x1={bx - 7} x2={bx - 1} y1={BASE + 5} y2={BASE - 5} style="stroke: var(--muted)" stroke-width="1.2" />
        <line x1={bx + 1} x2={bx + 7} y1={BASE + 5} y2={BASE - 5} style="stroke: var(--muted)" stroke-width="1.2" />
      {/each}
    {/if}
    {#each placed as d, i (d.id)}
      <line x1={d.cx} x2={d.cx} y1={BASE} y2={d.cy} style="stroke: var(--rule)" />
      <circle
        class="dot" class:sel={i === sel} class:ring={d.doctor === false && !d.featured} class:christ={d.featured}
        cx={d.cx} cy={d.cy} r={(d.featured ? 2 : 0) + (i === sel ? 8 : 6)}
        style="--dc: var(--{d.era}); animation-delay: {i * 25}ms"
        role="button" tabindex="0" aria-label="{d.name}, {d.dates ?? `died ${d.died}`}"
        onclick={() => (sel = i)}
        onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), (sel = i))}
      ><title>{d.name}</title></circle>
    {/each}
  </svg>
  {#if hasOthers}
    <p class="legend">
      {#if hasFeatured}<span class="k"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5" class="dot christ" /></svg> Jesus Christ</span>{/if}
      <span class="k"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="5" class="dot" /></svg> Doctor of the Church</span>
      <span class="k"><svg viewBox="0 0 12 12" aria-hidden="true"><circle cx="6" cy="6" r="4.2" class="dot ring" /></svg> Other {hasScripture ? 'figure of Scripture, ' : ''}saint or theologian</span>
    </p>
  {/if}
</div>

<div class="panel detail" style="--c: var(--{cur.era})" aria-live="polite">
  <div class="yr" class:long={when(cur).length > 6}>{when(cur)}</div>
  <h3><a href="/teachers/{cur.id}/">{cur.name}</a></h3>
  <p>{cur.summary}</p>
  <div class="row">
    <button class="ghost" onclick={() => step(-1)}>Previous</button>
    <button class="ghost" onclick={() => step(1)}>Next</button>
  </div>
</div>

<style>
  .box { background: var(--surface); border: 1px solid var(--rule); border-radius: 8px; padding: 16px; overflow-x: auto; }
  svg.chart { display: block; min-width: 720px; width: 100%; height: auto; font-family: var(--body); font-size: 12px; }
  .seg { font-family: var(--label); font-size: 12.5px; font-weight: 700; letter-spacing: .08em; text-transform: lowercase; }
  .dot { cursor: pointer; transform-box: fill-box; animation: pop .5s both; fill: var(--dc, var(--muted)); }
  .dot.ring { fill: var(--surface); stroke: var(--dc, var(--muted)); stroke-width: 2.5; }
  .dot.christ { fill: var(--gold); stroke: var(--surface); stroke-width: 1.5; }
  .legend { display: flex; flex-wrap: wrap; gap: 4px 18px; margin: 8px 0 0; font-size: 13.5px; color: var(--muted); }
  .legend .k { display: inline-flex; align-items: center; gap: 6px; }
  .legend svg { width: 12px; height: 12px; }
  .legend .dot { animation: none; cursor: default; }
  .dot:hover { r: 8; }
  .dot.christ:hover { r: 10; }
  @media (prefers-reduced-motion: reduce) { .dot { animation: none; } }
  @keyframes pop { from { opacity: .25; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .detail { grid-template-columns: auto minmax(0, 1fr); gap: 4px 16px; margin-top: 12px; }
  .yr { font-family: var(--display); font-size: 30px; line-height: 1; font-variant-numeric: tabular-nums; color: var(--c); white-space: nowrap; }
  .yr.long { font-size: 19px; padding-top: 4px; }
  h3 { font-size: 22px; }
  h3 a { text-decoration: none; }
  h3 a:hover { text-decoration: underline; text-decoration-color: var(--gold); }
  p, .row { grid-column: 2; margin: 0; }
  p { color: var(--muted); }
  .row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
</style>
