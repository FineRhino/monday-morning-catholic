<script lang="ts">
  import { removePassage, savePassage, store } from '../lib/store.svelte';
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
  .add { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; }
  .full { grid-column: 1 / -1; }
</style>
