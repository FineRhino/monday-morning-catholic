<script lang="ts">
  import { account, deleteAccount, exportData, sendSignInCode, signOut, store, verifySignInCode } from '../lib/store.svelte';
  import { supabase } from '../lib/supabase';

  let email = $state('');
  let code = $state('');
  let step = $state<'email' | 'code'>('email');
  let busy = $state(false);
  let error = $state('');

  async function run(action: () => Promise<void>) {
    busy = true;
    error = '';
    try {
      await action();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      busy = false;
    }
  }

  function send(e: SubmitEvent) {
    e.preventDefault();
    void run(async () => {
      await sendSignInCode(email.trim());
      step = 'code';
    });
  }

  function verify(e: SubmitEvent) {
    e.preventDefault();
    void run(async () => {
      await verifySignInCode(email.trim(), code.replace(/\s/g, ''));
      code = '';
      step = 'email';
    });
  }

  function download() {
    const url = URL.createObjectURL(new Blob([exportData()], { type: 'application/json' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `monday-morning-catholic-${new Date().toLocaleDateString('en-CA')}.json` });
    a.click();
    URL.revokeObjectURL(url);
  }

  function remove() {
    if (!confirm('Delete your account and everything saved in it? This cannot be undone.')) return;
    void run(deleteAccount);
  }

  const counts = $derived(`${store.prayerList.length} on your prayer list, ${store.savedPrayers.length} saved prayers, ${store.passages.length} saved passages`);
</script>

{#if !supabase}
  <p class="panel">Accounts aren't available on this site yet. Everything you save stays in this browser.</p>
{:else if !account.ready}
  <p class="muted">Checking whether you're signed in…</p>
{:else if account.user}
  <section class="panel">
    <h2>Signed in</h2>
    <p>You're signed in as <b>{account.user.email}</b>. What you save is kept in your account and shows up on any device where you sign in.</p>
    <p class="muted">{counts}.</p>
    <div class="row">
      <button class="ghost" onclick={download}>Download my data</button>
      <button class="btn" onclick={() => void run(signOut)} disabled={busy}>Sign out</button>
    </div>
  </section>
  <section class="panel danger">
    <h2>Delete account</h2>
    <p>Deletes your account and everything saved in it: your prayer list, saved prayers, passages, and notes. Download your data first if you want a copy.</p>
    <div class="row"><button class="ghost" onclick={remove} disabled={busy}>Delete my account</button></div>
  </section>
{:else if step === 'email'}
  <form class="panel" onsubmit={send}>
    <h2>Sign in or create an account</h2>
    <p>Enter your email and we'll send you a 6-digit code. No password needed. If you don't have an account yet, this creates one.</p>
    <label class="field-label">
      Email
      <input class="field" type="email" bind:value={email} autocomplete="email" required />
    </label>
    <div class="row"><button class="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Email me a code'}</button></div>
    <p class="muted small">Anything already saved in this browser is copied into your account when you sign in.</p>
  </form>
{:else}
  <form class="panel" onsubmit={verify}>
    <h2>Check your email</h2>
    <p>We sent a code to <b>{email}</b>. Enter it below, or click the link in the email instead.</p>
    <label class="field-label">
      Code
      <input class="field code" bind:value={code} inputmode="numeric" autocomplete="one-time-code" maxlength="10" required />
    </label>
    <div class="row">
      <button class="btn" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Sign in'}</button>
      <button class="ghost" type="button" onclick={() => { step = 'email'; error = ''; }}>Use a different email</button>
    </div>
  </form>
{/if}

{#if error}<p class="error" role="alert">{error}</p>{/if}

<style>
  .panel { margin: 0; width: 100%; max-width: 560px; }
  .panel p { margin: 0; }
  .panel h2 { font-size: 22px; }
  .row { display: flex; gap: 8px; flex-wrap: wrap; }
  .field-label { display: grid; gap: 4px; font-size: 14px; color: var(--muted); }
  .code { font-size: 22px; letter-spacing: .3em; max-width: 12ch; }
  .small { font-size: 14px; }
  .danger { border-color: color-mix(in srgb, var(--era3) 45%, var(--rule)); }
  .btn:disabled, .ghost:disabled { opacity: .55; cursor: default; }
  .error { margin: 0; color: var(--era3); }
</style>
