<script lang="ts">
  import { isPassageSaved, removePassage, savePassage, store } from '../lib/store.svelte';
  import { VERSES } from '../data/verses';

  // Verse of the day: changes daily, and "Another" cycles through the list.
  let vi = $state(Math.floor(Date.now() / 864e5) % VERSES.length);
  const verse = $derived(VERSES[vi]);
  const verseSaved = $derived(isPassageSaved(verse.ref));

  // Lookup uses bible-api.com's public-domain Douay-Rheims (Psalms follow Douay numbering).
  interface ApiVerse { text: string; }
  let ref = $state('');
  let note = $state('');
  let found = $state<{ ref: string; text: string } | null>(null);
  let loading = $state(false);
  let error = $state('');
  let canSaveAnyway = $state(false);
  const foundSaved = $derived(found ? isPassageSaved(found.ref) : false);
  // Saved passages whose full text is showing; the rest are cut to three lines.
  let expanded = $state<string[]>([]);
  const toggleExpanded = (id: string) => (expanded = expanded.includes(id) ? expanded.filter((x) => x !== id) : [...expanded, id]);

  function reset() {
    found = null;
    error = '';
    canSaveAnyway = false;
  }

  async function lookup(e: SubmitEvent) {
    e.preventDefault();
    const q = ref.trim();
    if (!q || loading) return;
    reset();
    loading = true;
    try {
      const res = await fetch(`https://bible-api.com/${encodeURIComponent(q)}?translation=dra`);
      if (res.status === 404) {
        error = `Couldn't find "${q}". Check the book name and numbers, for example John 14:27 or Matthew 5:3-10.`;
      } else if (!res.ok) {
        error = res.status === 429 ? 'Too many lookups at once. Wait a few seconds and try again.' : "The lookup service isn't responding right now.";
        canSaveAnyway = res.status !== 429;
      } else {
        const data: { reference: string; verses: ApiVerse[] } = await res.json();
        found = { ref: data.reference, text: data.verses.map((v) => v.text.trim()).join(' ') };
      }
    } catch {
      error = "Couldn't reach the lookup service. Check your connection.";
      canSaveAnyway = true;
    } finally {
      loading = false;
    }
  }

  function clear() {
    reset();
    ref = '';
    note = '';
  }

  function saveFound() {
    if (!found) return;
    savePassage(found.ref, found.text, note.trim());
    clear();
  }

  function saveReferenceOnly() {
    savePassage(ref.trim(), undefined, note.trim());
    clear();
  }
</script>

<div class="panel">
  <div class="ph"><h2>Saved passages</h2>{#if store.passages.length}<span class="count">{store.passages.length} saved</span>{/if}</div>

  <figure class="quote">
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

  <form class="add" onsubmit={lookup}>
    <input class="field" id="sp-ref" bind:value={ref} oninput={reset} placeholder="Look up a passage, e.g. John 14:27" aria-label="Scripture reference" maxlength="60" required />
    <button class="btn" type="submit" disabled={loading}>{loading ? 'Looking…' : 'Look up'}</button>
  </form>

  {#if error}
    <p class="msg" role="alert">
      {error}
      {#if canSaveAnyway}<button class="linkish" onclick={saveReferenceOnly}>Save the reference without the text</button>{/if}
    </p>
  {/if}

  {#if found}
    <figure class="quote found">
      <blockquote>{found.text}</blockquote>
      <figcaption><span>{found.ref} · Douay-Rheims</span></figcaption>
      <input class="field" id="sp-note" bind:value={note} placeholder="Why it matters to you, or what to explore (optional)" aria-label="Note" maxlength="200" />
      <div class="row">
        <button class="btn" onclick={saveFound} disabled={foundSaved}>{foundSaved ? 'Already saved' : 'Save passage'}</button>
        <button class="ghost" onclick={clear}>Cancel</button>
      </div>
    </figure>
  {/if}

  {#if store.passages.length}
    <ul class="list">
      {#each store.passages as p (p.id)}
        <li>
          <span class="t">{p.ref}</span>
          {#if p.text}
            <button class="s ptext" class:clamp={!expanded.includes(p.id)} aria-expanded={expanded.includes(p.id)} onclick={() => toggleExpanded(p.id)} title="Show or hide the full text">{p.text}</button>
          {/if}
          {#if p.note}<span class="s pnote">{p.note}</span>{/if}
          <span class="acts">
            <button class="ic" onclick={() => removePassage(p.ref)} aria-label="Remove {p.ref}">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">Look up a passage to read it and save it, with a note on what to explore. You can also save any verse from an article.</p>
  {/if}
</div>

<style>
  .quote { margin: 0; display: grid; gap: 6px; padding: 12px 14px; border-left: 3px solid var(--gold); border-radius: 0 6px 6px 0; background: var(--sunk); }
  blockquote { margin: 0; font-family: var(--display); font-style: italic; font-size: 18px; line-height: 1.4; }
  .found blockquote { max-height: 16em; overflow-y: auto; }
  figcaption { font-size: 14px; color: var(--muted); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  figcaption span { margin-right: auto; }
  .row { display: flex; gap: 8px; align-items: center; }
  .btn:disabled { opacity: .55; cursor: default; }
  .add { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; }
  .msg { margin: 0; font-size: 14px; color: var(--era3); }
  .linkish { display: block; margin-top: 4px; padding: 0; background: none; border: 0; color: var(--gold); text-decoration: underline; font-size: 14px; }
  .ptext { padding: 0; border: 0; background: none; text-align: left; font-family: var(--display); font-style: italic; font-size: 15px; color: var(--ink); }
  .pnote { border-left: 2px solid var(--gold); padding-left: 8px; margin-top: 4px; }
  .clamp { display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>
