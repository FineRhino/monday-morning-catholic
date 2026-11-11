<script lang="ts">
  import { addPerson, removePerson, store, today, togglePrayed } from '../lib/store.svelte';
  let name = $state('');
  let intention = $state('');
  function submit(e: SubmitEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addPerson(name.trim(), intention.trim());
    name = '';
    intention = '';
  }
</script>

<div class="panel">
  <div class="ph">
    <h2>My prayer list</h2>
    {#if store.prayerList.length}<span class="count">{store.prayerList.length} {store.prayerList.length === 1 ? 'person' : 'people'}</span>{/if}
  </div>
  <form class="add" onsubmit={submit}>
    <input class="field" id="pl-name" bind:value={name} placeholder="Name" aria-label="Name" maxlength="80" required />
    <button class="btn" type="submit">Add</button>
    <input class="field full" id="pl-intention" bind:value={intention} placeholder="Intention (optional): health, new job, peace at home" aria-label="Intention" maxlength="140" />
  </form>
  {#if store.prayerList.length}
    <ul class="list">
      {#each store.prayerList as p (p.id)}
        <li class:prayed={p.prayedOn === today()}>
          <span class="t">{p.name}</span>
          {#if p.intention}<span class="s">{p.intention}</span>{/if}
          <span class="acts">
            <button class="ic" onclick={() => togglePrayed(p.id)} aria-label="Mark {p.name} prayed for today">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8.5l3 3 7-7" /></svg>
            </button>
            <button class="ic" onclick={() => removePerson(p.id)} aria-label="Remove {p.name}">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="empty">Add the people you are praying for. Names stay on this device, or in your account if you sign in.</p>
  {/if}
</div>

<style>
  .add { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; }
  .full { grid-column: 1 / -1; }
  .prayed .t { color: var(--muted); text-decoration: line-through; text-decoration-color: var(--gold); }
</style>
