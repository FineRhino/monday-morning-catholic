<script lang="ts">
  import { isPassageSaved, removePassage, savePassage, store } from '../lib/store.svelte';
  import { VERSES } from '../data/verses';
  // Verse of the day: changes daily, and "Another" cycles through the list.
  let vi = $state(Math.floor(Date.now() / 864e5) % VERSES.length);
  const verse = $derived(VERSES[vi]);
  const verseSaved = $derived(isPassageSaved(verse.ref));
  let ref = $state('');
  let note = $state('');
  function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!ref.trim()) return;
    savePassage(ref.trim(), undefined, note.trim());
    ref = '';
    note = '';
  }
</script>

<div class="panel">
  <div class="ph"><h2>Saved passages</h2>{#if store.passages.length}<span class="count">{store.passages.length} saved</span>{/if}</div>
  <figure class="votd">
    <div class="label">verse of the day</div>
    <blockquote>{verse.text}</blockquote>
    <figcaption>
      <span>{verse.ref}</span>
      <button class="ghost" aria-pressed={verseSaved} onclick={() => (verseSaved ? removePassage(verse.ref) : savePassage(verse.ref, verse.text))}>
        {verseSaved ? 'Saved' : 'Save'}
      </button>
      <button class="ghost" onclick={() => (vi = (vi + 1) % VERSES.length)}>Another</button>
    </figcaption>
  </figure>
  <form class="add" onsubmit={submit}>
    <input class="field" id="sp-ref" bind:value={ref} placeholder="Reference, e.g. John 14:27" aria-label="Scripture reference" maxlength="60" required />
    <button class="btn" type="submit">Save</button>
    <input class="field full" id="sp-note" bind:value={note} placeholder="Why it matters to you, or what to explore" aria-label="Note" maxlength="200" />
  </form>
  {#if store.passages.length}
    <ul class="list">
      {#each store.passages as p (p.id)}
        <li>
          <span class="t">{p.ref}</span>
          {#if p.note || p.text}<span class="s">{p.note || p.text}</span>{/if}
          <span class="acts">
            <button class="ic" onclick={() => removePassage(p.ref)} aria-label="Remove {p.ref}">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">Save a passage to come back to, with a note on what to explore. You can also save any verse from an article.</p>
  {/if}
</div>

<style>
  .votd { margin: 0; display: grid; gap: 6px; padding: 12px 14px; border-left: 3px solid var(--gold); border-radius: 0 6px 6px 0; background: var(--sunk); }
  blockquote { margin: 0; font-family: var(--display); font-style: italic; font-size: 18px; line-height: 1.4; }
  figcaption { font-size: 14px; color: var(--muted); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  figcaption span { margin-right: auto; }
  .add { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; }
  .full { grid-column: 1 / -1; }
</style>
