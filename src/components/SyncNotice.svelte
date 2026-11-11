<script lang="ts">
  import { account } from '../lib/store.svelte';
</script>

{#if account.error}
  <div class="notice" role="alert">
    <span>{account.error}</span>
    <button class="ghost" onclick={() => (account.error = '')}>Dismiss</button>
  </div>
{/if}

<style>
  .notice { position: fixed; left: 16px; right: 16px; bottom: max(16px, env(safe-area-inset-bottom, 0px)); z-index: 10; margin: 0 auto; max-width: 560px; display: flex; gap: 12px; align-items: center; justify-content: space-between; padding: 12px 14px; border-radius: 8px; background: var(--surface); border: 1px solid var(--era3); box-shadow: 0 6px 24px rgb(0 0 0 / .15); font-size: 15px; }
</style>
