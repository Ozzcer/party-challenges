<script lang="ts">
  import { adminPost, ApiError } from '$lib/api';
  import { untrack } from 'svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let description = $state('');
  let score = $state(10);
  let type = $state<'SOLO' | 'ADVERSARIAL'>('SOLO');
  let attributeId = $state<number | null>(untrack(() => data.attributes[0]?.id ?? null));
  let error = $state<string | null>(null);
  let done = $state(false);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    error = null;
    try {
      await adminPost('/challenges', { description, score, type, attributeId });
      done = true;
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Something went wrong';
    }
  }
</script>

<h1>New challenge</h1>

{#if done}
  <p>Challenge created. You can close this tab.</p>
{:else}
  <form onsubmit={submit}>
    <label>
      Description
      <textarea bind:value={description} required></textarea>
    </label>
    <label>
      Attribute
      <select bind:value={attributeId}>
        {#each data.attributes as attr}
          <option value={attr.id}>{attr.name}</option>
        {/each}
      </select>
    </label>
    <label>
      Type
      <label><input type="radio" bind:group={type} value="SOLO" /> Solo</label>
      <label><input type="radio" bind:group={type} value="ADVERSARIAL" /> Adversarial</label>
    </label>
    <label>
      Score
      <input type="number" bind:value={score} min="1" required />
    </label>
    {#if error}
      <p>{error}</p>
    {/if}
    <button type="submit" disabled={!description.trim() || !attributeId}>Create</button>
  </form>
{/if}
