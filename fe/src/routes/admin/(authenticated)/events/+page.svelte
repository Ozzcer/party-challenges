<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<h1>Events</h1>
<a href="/admin/events/new">New event</a>

{#if data.events.length === 0}
  <p>No events yet.</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Players</th>
        <th>Instances</th>
        <th>Current</th>
      </tr>
    </thead>
    <tbody>
      {#each data.events as event}
        <tr>
          <td>
            <a href="/admin/events/{event.id}">
              {#if event.current}<strong>{event.name}</strong>{:else}{event.name}{/if}
            </a>
          </td>
          <td>{event.description}</td>
          <td>{event._count.players}</td>
          <td>{event._count.challengeInstances}</td>
          <td>{event.current ? 'Yes' : ''}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
