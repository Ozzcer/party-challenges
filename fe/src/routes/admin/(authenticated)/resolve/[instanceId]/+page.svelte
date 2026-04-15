<script lang="ts">
  import { adminPatch, ApiError } from '$lib/api';
  import { untrack } from 'svelte';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const isSolo = $derived(data.instance.challenge.type === 'SOLO');

  // SOLO: per-participant status selection
  let soloStatuses = $state<Record<number, 'COMPLETED' | 'FAILED'>>(
    untrack(() => Object.fromEntries(data.instance.participants.map((p) => [p.id, 'COMPLETED' as const]))),
  );

  // ADVERSARIAL: pick one winner
  let winnerId = $state<number | null>(untrack(() => data.instance.participants[0]?.id ?? null));

  let resolving = $state(false);
  let error = $state<string | null>(null);
  let done = $state(false);

  async function resolve() {
    resolving = true;
    error = null;

    const results = isSolo
      ? data.instance.participants.map((p) => ({ participantId: p.id, status: soloStatuses[p.id] }))
      : data.instance.participants.map((p) => ({
          participantId: p.id,
          status: (p.id === winnerId ? 'COMPLETED' : 'FAILED') as 'COMPLETED' | 'FAILED',
        }));

    try {
      await adminPatch(`/instances/${data.instance.id}/resolve`, { results });
      done = true;
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Something went wrong';
    } finally {
      resolving = false;
    }
  }
</script>

<a href="/admin">Back</a>
<h1>Resolve challenge</h1>

<p>
  <strong>{data.instance.challenge.description}</strong><br />
  {data.instance.challenge.attribute.name} · {data.instance.challenge.type} · {data.instance.challenge.score} pts
</p>

{#if done}
  <p>Challenge resolved!</p>
  <a href="/admin">Back to dashboard</a>
{:else}
  <section>
    <h2>Participants</h2>

    {#if isSolo}
      {#each data.instance.participants as p}
        <div>
          <span>{p.player.name ?? p.player.playerCode}</span>
          <label>
            <input type="radio" bind:group={soloStatuses[p.id]} value="COMPLETED" />
            Completed
          </label>
          <label>
            <input type="radio" bind:group={soloStatuses[p.id]} value="FAILED" />
            Failed
          </label>
        </div>
      {/each}
    {:else}
      <p>Pick the winner — all others will be marked as failed.</p>
      {#each data.instance.participants as p}
        <label>
          <input type="radio" bind:group={winnerId} value={p.id} />
          {p.player.name ?? p.player.playerCode}
        </label>
      {/each}
    {/if}
  </section>

  {#if error}
    <p>{error}</p>
  {/if}

  <button onclick={resolve} disabled={resolving || (!isSolo && winnerId === null)}>
    {resolving ? 'Resolving…' : 'Confirm resolution'}
  </button>
  <button onclick={() => goto('/admin')}>Cancel</button>
{/if}
