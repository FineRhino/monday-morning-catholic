<script lang="ts">
  import { RHYTHM } from '../data/prayers';
  import { isDone, toggleStep } from '../lib/store.svelte';
  const count = $derived(RHYTHM.filter((r) => isDone(r.id)).length);
</script>

<div class="panel">
  <div class="ph"><h2>Today's rhythm</h2><span class="count">{count} of {RHYTHM.length}</span></div>
  <div class="bar"><i style:width="{(count / RHYTHM.length) * 100}%"></i></div>
  <div class="steps">
    {#each RHYTHM as r (r.id)}
      <div class="step">
        <button class="toggle" aria-pressed={isDone(r.id)} onclick={() => toggleStep(r.id)}>
          <i class="tick"></i>
          <span><b>{r.title}</b><small>{r.hint}</small></span>
        </button>
        <span class="side">
          <span class="when">{r.when}</span>
          <a class="pray" href={r.href} aria-label={`${r.cta}: ${r.title}`}>{r.cta}</a>
        </span>
      </div>
    {/each}
  </div>
</div>

<style>
  .bar { height: 6px; background: var(--sunk); border-radius: 99px; overflow: hidden; }
  .bar i { display: block; height: 100%; background: var(--gold); transition: width .4s ease; }
  .steps { display: grid; gap: 8px; }
  .step { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 10px 12px; border-radius: 6px; background: var(--sunk); border: 1px solid transparent; }
  .step:hover { border-color: var(--rule); }
  .toggle { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; align-items: center; padding: 0; background: none; border: 0; text-align: left; width: 100%; }
  .toggle b { display: block; }
  .toggle small { font-size: 14px; color: var(--muted); }
  .tick { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--gold); display: grid; place-items: center; transition: background .2s; }
  .toggle[aria-pressed='true'] .tick { background: var(--gold); }
  .toggle[aria-pressed='true'] .tick::after { content: ''; width: 6px; height: 11px; border: solid var(--surface); border-width: 0 2px 2px 0; transform: rotate(45deg) translate(-1px, -1px); }
  .side { display: grid; justify-items: end; gap: 2px; }
  .when { font-family: var(--label); letter-spacing: .06em; color: var(--muted); font-size: 13px; }
  .pray { font-size: 14px; color: var(--gold); font-weight: 700; }
</style>
