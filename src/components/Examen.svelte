<script lang="ts">
  import { tick } from 'svelte';
  import { EXAMEN_STEPS } from '../data/examen';
  import { isDone, toggleStep } from '../lib/store.svelte';

  // -1 is the introduction; EXAMEN_STEPS.length is the closing screen.
  let current = $state(-1);
  // Notes are kept only while this page is open. They are never saved or sent anywhere.
  let notes = $state<string[]>(EXAMEN_STEPS.map(() => ''));
  let heading = $state<HTMLElement>();

  const step = $derived(current >= 0 && current < EXAMEN_STEPS.length ? EXAMEN_STEPS[current] : undefined);
  const finished = $derived(current === EXAMEN_STEPS.length);

  async function go(to: number) {
    current = to;
    if (to === EXAMEN_STEPS.length && !isDone('evening')) toggleStep('evening');
    // Move focus to the new heading so keyboard and screen reader users start at the top.
    await tick();
    heading?.focus();
    heading?.scrollIntoView({ block: 'nearest' });
  }
</script>

<div class="examen">
  {#if current >= 0}
    <ol class="progress" aria-label="Steps">
      {#each EXAMEN_STEPS as s, i}
        <li class:done={i < current || finished} class:now={i === current} aria-current={i === current ? 'step' : undefined}>
          <span class="visually-hidden">{s.title}</span>
        </li>
      {/each}
    </ol>
  {/if}

  {#if current === -1}
    <section class="card">
      <h2 bind:this={heading} tabindex="-1">Before you begin</h2>
      <p>The Examen is a short prayer at the end of the day, taught by St. Ignatius of Loyola. You look back over the day with God: to thank him, to notice where he was at work, to ask for mercy, and to prepare for tomorrow. It takes about 10 to 15 minutes.</p>
      <blockquote>
        Prove me, O God, and know my heart: examine me, and know my paths. And see if there be in me the way of iniquity: and lead me in the eternal way.
        <cite>Psalm 138:23–24 (139:23–24)</cite>
      </blockquote>
      <div class="nav"><button class="btn" onclick={() => go(0)}>Begin the Examen</button></div>
    </section>
  {:else if step}
    <section class="card" aria-labelledby="examen-step">
      <div class="label">step {current + 1} of {EXAMEN_STEPS.length}</div>
      <h2 id="examen-step" bind:this={heading} tabindex="-1">{step.title}</h2>
      <p>{step.guide}</p>
      <ul class="questions">
        {#each step.questions as q}<li>{q}</li>{/each}
      </ul>
      <p class="prayer">{step.prayer}</p>
      <label class="notes">
        <span>Your thoughts (optional, not saved)</span>
        <textarea class="field" rows="3" bind:value={notes[current]} placeholder="A word or two to hold on to"></textarea>
      </label>
      <div class="nav">
        <button class="ghost" onclick={() => go(current - 1)}>Back</button>
        <button class="btn" onclick={() => go(current + 1)}>{current === EXAMEN_STEPS.length - 1 ? 'Finish' : 'Next step'}</button>
      </div>
    </section>
  {:else if finished}
    <section class="card">
      <h2 bind:this={heading} tabindex="-1">Close with the Our Father</h2>
      <p>End your Examen by praying the prayer Jesus taught us, slowly.</p>
      <p class="prayer pre">Our Father, who art in heaven,
hallowed be thy name;
thy kingdom come,
thy will be done on earth as it is in heaven.
Give us this day our daily bread,
and forgive us our trespasses,
as we forgive those who trespass against us;
and lead us not into temptation,
but deliver us from evil. Amen.</p>
      <p class="muted">The Examen is checked off in today's rhythm. Your notes are not saved, so copy anything you want to keep before you leave.</p>
      <div class="nav">
        <button class="ghost" onclick={() => go(0)}>Go through it again</button>
        <a class="btn" href="/">Back to today</a>
      </div>
    </section>
  {/if}
</div>

<style>
  .examen { display: grid; gap: 16px; width: 100%; max-width: 720px; }
  .progress { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
  .progress li { height: 6px; border-radius: 99px; background: var(--sunk); border: 1px solid var(--rule); }
  .progress li.done { background: var(--gold); border-color: var(--gold); }
  .progress li.now { background: var(--gold-soft); border-color: var(--gold); }
  .card { background: var(--surface); border: 1px solid var(--rule); border-radius: 8px; padding: 22px; display: grid; gap: 14px; }
  .card p { margin: 0; font-size: 18px; }
  h2 { font-size: clamp(24px, 3.4vw, 30px); scroll-margin-top: 100px; }
  h2:focus { outline: none; }
  blockquote { margin: 0; border-left: 3px solid var(--gold); padding: 4px 0 4px 16px; font-family: var(--display); font-style: italic; font-size: 19px; line-height: 1.45; }
  cite { display: block; margin-top: 6px; font-family: var(--body); font-style: normal; font-size: 14px; color: var(--muted); }
  .questions { margin: 0; padding-left: 1.2em; display: grid; gap: 6px; font-size: 17px; }
  .prayer { font-family: var(--display); font-style: italic; color: var(--gold); }
  .pre { white-space: pre-line; color: var(--ink); line-height: 1.55; }
  .notes { display: grid; gap: 4px; font-size: 14px; color: var(--muted); }
  .notes textarea { resize: vertical; font-size: 16px; }
  .nav { display: flex; gap: 8px; justify-content: space-between; flex-wrap: wrap; }
  .nav .btn:only-child { margin-left: auto; }
  a.btn { text-decoration: none; display: inline-block; }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
