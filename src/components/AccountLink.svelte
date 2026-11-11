<script lang="ts">
  import { account } from '../lib/store.svelte';
  let { current = false }: { current?: boolean } = $props();
</script>

<a href="/account/" class:on={current}>{account.user ? 'Account' : 'Sign in'}</a>
