<script lang="ts">
  import { adminPatch, ApiError } from '$lib/api';
  import { untrack } from 'svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let name = $state(untrack(() => data.event.name));
  let description = $state(untrack(() => data.event.description));
  let current = $state(untrack(() => data.event.current));
  let editMessage = $state<string | null>(null);
  let saving = $state(false);

  async function save(e: SubmitEvent) {
    e.preventDefault();
    editMessage = null;
    saving = true;
    try {
      await adminPatch(`/events/${data.event.id}`, { name, description, current });
      editMessage = 'Saved';
    } catch (err) {
      editMessage = err instanceof ApiError ? err.message : 'Something went wrong';
    } finally {
      saving = false;
    }
  }
</script>

<a href="/admin/events">Back</a>
<h1>{data.event.name}</h1>

<section>
  <h2>Edit</h2>
  <form onsubmit={save}>
    <label>
      Name
      <input type="text" bind:value={name} required />
    </label>
    <label>
      Description
      <input type="text" bind:value={description} required />
    </label>
    <label>
      <input type="checkbox" bind:checked={current} />
      Current event
    </label>
    <button type="submit" disabled={saving}>Save</button>
    {#if editMessage}
      <span>{editMessage}</span>
    {/if}
  </form>
</section>

<section>
  <h2>Enrolled players ({data.event.players.length})</h2>
  {#if data.event.players.length === 0}
    <p>No players enrolled.</p>
  {:else}
    <ul>
      {#each data.event.players as ep}
        <li>{ep.player.name ?? ep.player.playerCode}</li>
      {/each}
    </ul>
  {/if}
</section>

<section>
  <h2>Challenge instances ({data.event.challengeInstances.length})</h2>
  {#if data.event.challengeInstances.length === 0}
    <p>No challenge instances.</p>
  {:else}
    <table>
      <thead>
        <tr>
          <th>Challenge</th>
          <th>Type</th>
          <th>Participants</th>
        </tr>
      </thead>
      <tbody>
        {#each data.event.challengeInstances as instance}
          <tr>
            <td>{instance.challenge.description}</td>
            <td>{instance.challenge.type}</td>
            <td>
              {#each instance.participants as p}
                <span>{p.player.name ?? p.player.playerCode} ({p.status})</span>
              {/each}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  <a href="/admin/events/{data.event.id}/assign">Assign challenge</a>
</section>
