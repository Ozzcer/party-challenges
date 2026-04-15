<script lang="ts">
  import { adminGet, adminPost, ApiError } from '$lib/api';
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';

  type Attribute = { id: number; name: string };
  type Challenge = { id: number; description: string; score: number; type: string; attribute: Attribute };
  type Player = { id: number; name: string | null; playerCode: string };

  let { data }: { data: PageData } = $props();

  // Step 1
  let type = $state<'SOLO' | 'ADVERSARIAL'>('SOLO');

  // Step 2
  let playerCodes = $state<string[]>(['']);
  let blurred = $state<boolean[]>([false]);
  let validatedPlayers = $state<Player[] | null>(null);
  let validating = $state(false);
  let validateError = $state<string | null>(null);

  // Step 3
  let challenges = $state<Challenge[]>([]);
  let selectedChallenge = $state<Challenge | null>(null);
  let refreshing = $state(false);
  let assigning = $state(false);
  let assignError = $state<string | null>(null);

  let step = $state<1 | 2 | 3>(1);

  function goToStep2() {
    playerCodes = type === 'ADVERSARIAL' ? ['', ''] : [''];
    blurred = type === 'ADVERSARIAL' ? [false, false] : [false];
    validatedPlayers = null;
    validateError = null;
    step = 2;
  }

  function addPlayer() {
    playerCodes = [...playerCodes, ''];
    blurred = [...blurred, false];
  }

  function removePlayer(index: number) {
    playerCodes = playerCodes.filter((_, i) => i !== index);
    blurred = blurred.filter((_, i) => i !== index);
  }

  async function fetchChallenges() {
    const playerIds = validatedPlayers!.map((p) => p.id).join(',');
    const available = await adminGet<Challenge[]>(
      `/events/${data.eventId}/available-challenges?playerIds=${playerIds}&type=${type}`,
    );
    challenges = available ?? [];
  }

  async function refreshChallenges() {
    refreshing = true;
    try {
      await fetchChallenges();
    } finally {
      refreshing = false;
    }
  }

  async function validateAndNext() {
    const codes = playerCodes.map((c) => c.trim()).filter(Boolean);
    if (codes.length === 0) {
      validateError = 'Enter at least one player code';
      return;
    }
    if (type === 'ADVERSARIAL' && codes.length < 2) {
      validateError = 'Adversarial challenges require at least 2 players';
      return;
    }
    if (new Set(codes).size !== codes.length) {
      validateError = 'Each player code must be unique';
      return;
    }

    validating = true;
    validateError = null;
    try {
      const result = await adminPost<{ players: Player[] }>(
        `/events/${data.eventId}/validate-players`,
        { playerCodes: codes },
      );
      validatedPlayers = result?.players ?? [];
      await fetchChallenges();
      selectedChallenge = null;
      assignError = null;
      step = 3;
    } catch (err) {
      validateError = err instanceof ApiError ? err.message : 'Something went wrong';
    } finally {
      validating = false;
    }
  }

  async function assign() {
    if (!selectedChallenge || !validatedPlayers) return;
    assigning = true;
    assignError = null;
    try {
      await adminPost(`/events/${data.eventId}/instances`, {
        challengeId: selectedChallenge.id,
        playerIds: validatedPlayers.map((p) => p.id),
      });
      goto(`/admin/events/${data.eventId}`);
    } catch (err) {
      assignError = err instanceof ApiError ? err.message : 'Failed to assign challenge';
    } finally {
      assigning = false;
    }
  }
</script>

<a href="/admin/events/{data.eventId}">Back</a>
<h1>Assign challenge</h1>

{#if step === 1}
  <label>
    <input type="radio" bind:group={type} value="SOLO" />
    Solo
  </label>
  <label>
    <input type="radio" bind:group={type} value="ADVERSARIAL" />
    Adversarial
  </label>
  <div>
    <button onclick={goToStep2}>Next</button>
  </div>

{:else if step === 2}
  <p>Enter player code{type === 'ADVERSARIAL' ? 's' : ''}:</p>

  {#each playerCodes as _, i}
    <div>
      <input
        type="text"
        placeholder="Player code"
        bind:value={playerCodes[i]}
        onblur={() => { blurred[i] = true; }}
      />
      {#if playerCodes.length > 1}
        <button onclick={() => removePlayer(i)}>Remove</button>
      {/if}
    </div>
  {/each}

  {#if type === 'ADVERSARIAL'}
    <button onclick={addPlayer}>+ Add player</button>
  {/if}

  {#if validateError}
    <p>{validateError}</p>
  {/if}

  <div>
    <button onclick={() => { step = 1; }}>Back</button>
    <button onclick={validateAndNext} disabled={validating}>
      {validating ? 'Checking…' : 'Next'}
    </button>
  </div>

{:else if step === 3}
  <p>
    Players: {validatedPlayers!.map((p) => p.name ?? p.playerCode).join(', ')}
  </p>

  <a href="/admin/challenges/new" target="_blank">Create a challenge</a>
  <button onclick={refreshChallenges} disabled={refreshing}>{refreshing ? 'Refreshing…' : 'Refresh'}</button>

  {#if challenges.length === 0}
    <p>No available challenges for these players.</p>
  {:else}
    <table>
      <thead>
        <tr><th>Description</th><th>Attribute</th><th>Score</th><th></th></tr>
      </thead>
      <tbody>
        {#each challenges as c}
          <tr class:selected={selectedChallenge?.id === c.id}>
            <td>{c.description}</td>
            <td>{c.attribute.name}</td>
            <td>{c.score}</td>
            <td><button onclick={() => { selectedChallenge = c; }}>Select</button></td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}

  {#if selectedChallenge}
    <p>Selected: <strong>{selectedChallenge.description}</strong></p>
  {/if}

  {#if assignError}
    <p>{assignError}</p>
  {/if}

  <div>
    <button onclick={() => { step = 2; }}>Back</button>
    <button onclick={assign} disabled={assigning || !selectedChallenge}>
      {assigning ? 'Assigning…' : 'Confirm'}
    </button>
  </div>
{/if}
