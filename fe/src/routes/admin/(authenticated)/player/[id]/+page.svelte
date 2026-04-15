<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const displayName = $derived(data.player.name ?? data.player.playerCode);
</script>

<a href="/admin">Back</a>
<h1>{displayName}</h1>
<p>Code: <strong>{data.player.playerCode}</strong></p>

<section>
  <h2>Active challenge</h2>
  {#if data.instance}
    <p>
      <strong>{data.instance.challenge.description}</strong><br />
      {data.instance.challenge.attribute.name} · {data.instance.challenge.type} · {data.instance.challenge.score} pts
    </p>
    <a href="/admin/resolve/{data.instance.id}">Resolve</a>
  {:else}
    <p>No active challenge.</p>
  {/if}
</section>

<section>
  <h2>Actions</h2>
  {#if data.activeEventId && !data.instance}
    <a href="/admin/events/{data.activeEventId}/assign">Create challenge</a>
  {:else}
    <button disabled>Create challenge</button>
  {/if}
</section>
