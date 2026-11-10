<script lang="ts">
  import { PRAYER_CATEGORIES, type Prayer } from '../data/prayers';
  import { isPrayerSaved, store, togglePrayer } from '../lib/store.svelte';

  let { prayers }: { prayers: Prayer[] } = $props();

  type Sort = 'az' | 'za' | 'category' | 'saved';
  let query = $state('');
  let sort = $state<Sort>('az');

  // Saved state lives in this browser, so wait until the page is running here before showing it.
  let mounted = $state(false);
  $effect(() => { mounted = true; });
  const saved = (id: string) => mounted && isPrayerSaved(id);

  const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "'");
  const byTitle = (a: Prayer, b: Prayer) => a.title.replace(/^(The|St\.) /, '').localeCompare(b.title.replace(/^(The|St\.) /, ''));

  const shown = $derived.by(() => {
    const words = norm(query).split(/\s+/).filter(Boolean);
    const matches = prayers.filter((p) => {
      const hay = norm(`${p.title} ${p.category} ${p.text} ${p.note ?? ''}`);
      return words.every((w) => hay.includes(w));
    });
    // Read the saved list here so this re-sorts when a prayer is saved.
    void store.savedPrayers.length;
    return matches.sort((a, b) => {
      if (sort === 'za') return byTitle(b, a);
      if (sort === 'category') return PRAYER_CATEGORIES.indexOf(a.category) - PRAYER_CATEGORIES.indexOf(b.category) || byTitle(a, b);
      if (sort === 'saved') return Number(saved(b.id)) - Number(saved(a.id)) || byTitle(a, b);
      return byTitle(a, b);
    });
  });
</script>

<div class="tools">
  <label class="search">
    <span class="visually-hidden">Search prayers</span>
    <input class="field" type="search" bind:value={query} placeholder="Search by name or words, e.g. angel" />
  </label>
  <label class="sort">
    Sort
    <select class="field" bind:value={sort}>
      <option value="az">Title, A to Z</option>
      <option value="za">Title, Z to A</option>
      <option value="category">Category</option>
      <option value="saved">My saved first</option>
    </select>
  </label>
</div>
<p class="count" aria-live="polite">
  {shown.length === prayers.length ? `${prayers.length} prayers` : `${shown.length} of ${prayers.length} prayers`}
</p>

<div class="list">
  {#each shown as p (p.id)}
    <article class="prayer" id={p.id}>
      <header>
        <div>
          <div class="label">{p.category}</div>
          <h2><a href={`#${p.id}`}>{p.title}</a></h2>
        </div>
        <button class="ghost" aria-pressed={saved(p.id)} onclick={() => togglePrayer(p.id)}>{saved(p.id) ? 'Saved' : 'Save prayer'}</button>
      </header>
      <p class="text">{p.text}</p>
      {#if p.note}<p class="note">{p.note}</p>{/if}
    </article>
  {:else}
    <p class="empty">No prayers match "{query}". <button class="ghost" onclick={() => (query = '')}>Clear search</button></p>
  {/each}
</div>

<style>
  .tools { display: flex; flex-wrap: wrap; gap: 10px; align-items: end; width: 100%; }
  .search { flex: 1 1 260px; }
  .sort { display: grid; gap: 4px; font-size: 14px; color: var(--muted); flex: 0 1 200px; }
  .count { margin: 0; font-size: 14px; color: var(--muted); }
  .list { display: grid; gap: 14px; width: 100%; }
  .prayer { background: var(--surface); border: 1px solid var(--rule); border-radius: 8px; padding: 18px; display: grid; gap: 10px; scroll-margin-top: 90px; }
  .prayer:target { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold-soft); }
  header { display: flex; justify-content: space-between; align-items: start; gap: 12px; flex-wrap: wrap; }
  h2 { font-size: 22px; }
  h2 a { text-decoration: none; }
  h2 a:hover { text-decoration: underline; text-decoration-color: var(--gold); }
  .text { margin: 0; font-family: var(--display); font-size: 18px; line-height: 1.55; white-space: pre-line; max-width: 62ch; }
  .note { margin: 0; font-size: 15px; color: var(--muted); border-left: 2px solid var(--gold); padding-left: 10px; max-width: 62ch; }
  .empty { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
