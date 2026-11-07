<script lang="ts">
  import { isPassageSaved, removePassage, savePassage } from '../lib/store.svelte';
  let { ref, text }: { ref: string; text: string } = $props();
  const saved = $derived(isPassageSaved(ref));
</script>

<figure class="scripture">
  <blockquote>{text}</blockquote>
  <figcaption>
    <span>{ref}</span>
    <button class="ghost" aria-pressed={saved} onclick={() => (saved ? removePassage(ref) : savePassage(ref, text))}>
      {saved ? 'Saved' : 'Save passage'}
    </button>
  </figcaption>
</figure>

<style>
  .scripture { margin: 24px 0; border-left: 3px solid var(--gold); padding: 4px 0 4px 16px; display: grid; gap: 6px; }
  blockquote { margin: 0; font-family: var(--display); font-style: italic; font-size: 20px; line-height: 1.4; }
  figcaption { font-size: 14px; color: var(--muted); display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
</style>
