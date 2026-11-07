<script lang="ts">
  import { PRAYERS } from '../data/prayers';
  import { isPrayerSaved, store, togglePrayer } from '../lib/store.svelte';
  let current = $state('offering');
  let mine = $state(false);
  const shown = $derived(mine ? PRAYERS.filter((p) => store.savedPrayers.includes(p.id)) : PRAYERS);
  const prayer = $derived(PRAYERS.find((p) => p.id === current)!);
</script>

<div class="panel">
  <div class="ph"><h2>Prayers</h2>{#if store.savedPrayers.length}<span class="count">{store.savedPrayers.length} saved</span>{/if}</div>
  <div class="chips">
    <button class="ghost" aria-pressed={!mine} onclick={() => (mine = false)}>All prayers</button>
    <button class="ghost" aria-pressed={mine} onclick={() => (mine = true)}>My saved</button>
  </div>
  <div class="chips">
    {#each shown as p (p.id)}
      <button class="ghost" aria-pressed={p.id === current} onclick={() => (current = p.id)}>{p.title}</button>
    {:else}
      <p class="empty">No saved prayers yet. Open one and tap Save prayer.</p>
    {/each}
  </div>
  <div class="row">
    <h3>{prayer.title}</h3>
    <button class="ghost" aria-pressed={isPrayerSaved(current)} onclick={() => togglePrayer(current)}>
      {isPrayerSaved(current) ? 'Saved' : 'Save prayer'}
    </button>
  </div>
  <p class="text">{prayer.text}</p>
</div>

<style>
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .row { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
  h3 { font-size: 18px; }
  .text { font-family: var(--display); font-size: 16.5px; line-height: 1.5; white-space: pre-line; background: var(--sunk); border-radius: 6px; padding: 12px 14px; margin: 0; max-height: 240px; overflow: auto; }
</style>
