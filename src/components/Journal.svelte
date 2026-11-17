<script lang="ts">
  /** "My notes": a visitor's own dated journal entries, newest first. */
  import { addNote, removeNote, store, updateNote } from '../lib/store.svelte';

  const MAX = 5000;
  const SHOW = 5;

  let draft = $state('');
  let editing = $state<string | null>(null);
  let editText = $state('');
  let confirming = $state<string | null>(null);
  let showAll = $state(false);

  const shown = $derived(showAll ? store.notes : store.notes.slice(0, SHOW));
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    addNote(draft.trim());
    draft = '';
  }
  function startEdit(id: string, body: string) {
    editing = id;
    editText = body;
    confirming = null;
  }
  function saveEdit(id: string) {
    if (editText.trim()) updateNote(id, editText.trim());
    editing = null;
  }
  function askRemove(id: string) {
    if (confirming === id) {
      removeNote(id);
      confirming = null;
    } else {
      confirming = id;
    }
  }
</script>

<div class="panel" id="notes">
  <div class="ph">
    <h2>My notes</h2>
    {#if store.notes.length}<span class="count">{store.notes.length} {store.notes.length === 1 ? 'note' : 'notes'}</span>{/if}
  </div>
  <form class="add" onsubmit={submit}>
    <textarea class="field" id="journal-new" bind:value={draft} rows="4" maxlength={MAX}
      placeholder="What stood out in today's readings? Where did you meet God today? What do you want to bring to prayer?"
      aria-label="New note"></textarea>
    <div class="bar">
      <span class="hint">{draft.length > MAX - 500 ? `${MAX - draft.length} characters left` : ''}</span>
      <button class="btn" type="submit" disabled={!draft.trim()}>Save note</button>
    </div>
  </form>

  {#if store.notes.length}
    <ol class="notes">
      {#each shown as n (n.id)}
        <li>
          <div class="when">
            <time datetime={n.createdAt}>{fmt(n.createdAt)}</time>
            {#if n.updatedAt}<span class="edited">edited</span>{/if}
          </div>
          {#if editing === n.id}
            <textarea class="field" id="journal-edit-{n.id}" bind:value={editText} rows="5" maxlength={MAX} aria-label="Edit note"></textarea>
            <div class="acts">
              <button class="btn" type="button" onclick={() => saveEdit(n.id)} disabled={!editText.trim()}>Save</button>
              <button class="ghost" type="button" onclick={() => (editing = null)}>Cancel</button>
            </div>
          {:else}
            <p class="body">{n.body}</p>
            <div class="acts">
              <button class="ghost" type="button" onclick={() => startEdit(n.id, n.body)}>Edit</button>
              <button class="ghost" class:danger={confirming === n.id} type="button" onclick={() => askRemove(n.id)}
                onblur={() => confirming === n.id && (confirming = null)}>
                {confirming === n.id ? 'Delete this note?' : 'Delete'}
              </button>
            </div>
          {/if}
        </li>
      {/each}
    </ol>
    {#if store.notes.length > SHOW}
      <button class="ghost more" type="button" onclick={() => (showAll = !showAll)}>
        {showAll ? 'Show fewer' : `Show all ${store.notes.length} notes`}
      </button>
    {/if}
  {:else}
    <p class="empty">Your notes appear here, newest first, with the date you wrote them. They stay on this device, or in your account if you sign in.</p>
  {/if}
</div>

<style>
  .add { display: grid; gap: 8px; }
  textarea { resize: vertical; line-height: 1.5; }
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .hint { font-size: 13px; color: var(--muted); }
  .btn:disabled { opacity: .45; cursor: default; }
  .notes { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .notes li { display: grid; gap: 6px; padding: 12px 14px; border-radius: 6px; background: var(--sunk); border-left: 3px solid var(--gold); }
  .when { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 10px; }
  time { font-family: var(--label); font-size: 14px; font-weight: 700; letter-spacing: .05em; color: var(--gold); }
  .edited { font-size: 12.5px; color: var(--muted); }
  .body { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
  .acts { display: flex; flex-wrap: wrap; gap: 6px; }
  .danger { border-color: var(--era3); color: var(--era3); }
  .more { justify-self: start; }
</style>
