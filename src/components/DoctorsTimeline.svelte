<script lang="ts">
  interface Doc { id: string; name: string; died: number; era: string; summary: string; }
  let { doctors, initial = 'augustine-of-hippo' }: { doctors: Doc[]; initial?: string } = $props();

  const L = 30, R = 975, BASE = 110, MIN = 100, MAX = 2000;
  const x = (v: number) => L + ((v - MIN) / (MAX - MIN)) * (R - L);
  const ticks = Array.from({ length: 18 }, (_, i) => 200 + i * 100);

  // Stack dots that would overlap.
  const placed = (() => {
    const stack: Record<number, number> = {};
    return doctors.map((d) => {
      const b = Math.round(x(d.died) / 14);
      stack[b] = (stack[b] ?? 0) + 1;
      return { ...d, cx: x(d.died), cy: BASE - 14 - (stack[b] - 1) * 16 };
    });
  })();

  let sel = $state(Math.max(0, doctors.findIndex((d) => d.id === initial)));
  const cur = $derived(placed[sel]);
  const step = (n: number) => (sel = (sel + n + placed.length) % placed.length);
</script>

<div class="box">
  <svg viewBox="0 0 1000 150" role="group" aria-label="Timeline of the Doctors of the Church by year of death">
    <line x1={L} x2={R} y1={BASE} y2={BASE} style="stroke: var(--ink)" stroke-width="1.2" />
    {#each ticks as t}
      <line x1={x(t)} x2={x(t)} y1={BASE} y2={BASE + 6} style="stroke: var(--muted)" />
      {#if t % 200 === 0}<text x={x(t)} y={BASE + 24} text-anchor="middle" style="fill: var(--muted)">{t}</text>{/if}
    {/each}
    {#each placed as d, i (d.id)}
      <line x1={d.cx} x2={d.cx} y1={BASE} y2={d.cy} style="stroke: var(--rule)" />
      <circle
        class="dot" class:sel={i === sel}
        cx={d.cx} cy={d.cy} r={i === sel ? 8 : 6}
        style="fill: var(--{d.era}); animation-delay: {i * 35}ms"
        role="button" tabindex="0" aria-label="{d.name}, died {d.died}"
        onclick={() => (sel = i)}
        onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), (sel = i))}
      ><title>{d.name}</title></circle>
    {/each}
  </svg>
</div>

<div class="panel detail" style="--c: var(--{cur.era})" aria-live="polite">
  <div class="yr">{cur.died}</div>
  <h3><a href="/teachers/{cur.id}/">{cur.name}</a></h3>
  <p>{cur.summary}</p>
  <div class="row">
    <button class="ghost" onclick={() => step(-1)}>Previous</button>
    <button class="ghost" onclick={() => step(1)}>Next</button>
  </div>
</div>

<style>
  .box { background: var(--surface); border: 1px solid var(--rule); border-radius: 8px; padding: 16px; overflow-x: auto; }
  svg { display: block; min-width: 720px; width: 100%; height: auto; font-family: var(--body); font-size: 12px; }
  .dot { cursor: pointer; transform-box: fill-box; animation: pop .5s both; }
  .dot:hover { r: 8; }
  @keyframes pop { from { opacity: .25; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .detail { grid-template-columns: auto minmax(0, 1fr); gap: 4px 16px; margin-top: 12px; }
  .yr { font-family: var(--display); font-size: 30px; line-height: 1; font-variant-numeric: tabular-nums; color: var(--c); }
  h3 { font-size: 22px; }
  h3 a { text-decoration: none; }
  h3 a:hover { text-decoration: underline; text-decoration-color: var(--gold); }
  p, .row { grid-column: 2; margin: 0; }
  p { color: var(--muted); }
  .row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
</style>
