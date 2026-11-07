<script lang="ts">
  import { VERSES } from '../data/verses';
  import Scripture from './Scripture.svelte';
  let i = $state(Math.floor(Date.now() / 864e5) % VERSES.length);
  const v = $derived(VERSES[i]);
</script>

{#key i}<Scripture ref={v.ref} text={v.text} />{/key}
<button class="ghost" onclick={() => (i = (i + 1) % VERSES.length)}>Another verse</button>
