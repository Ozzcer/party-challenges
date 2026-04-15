<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  import { adminGet, ApiError } from '$lib/api';
  import { goto } from '$app/navigation';

  let { children } = $props();

  let playerCode = $state('');
  let playerMessage = $state<string | null>(null);
  let searching = $state(false);

  async function lookupPlayer(e: SubmitEvent) {
    e.preventDefault();
    const code = playerCode.trim();
    if (!code) return;
    searching = true;
    playerMessage = null;
    try {
      const result = await adminGet<{ player: { id: number }; instance: { id: number } | null }>(
        `/players/by-code/${encodeURIComponent(code)}`,
      );
      if (!result) {
        playerMessage = 'Player not found';
        return;
      }
      playerCode = '';
      goto(`/admin/player/${result.player.id}`);
    } catch (err) {
      playerMessage = err instanceof ApiError && err.statusCode === 404 ? 'Player not found' : 'Something went wrong';
    } finally {
      searching = false;
    }
  }
</script>

<nav>
  <a href="/admin">Home</a>
  <a href="/admin/events">Events</a>
  <form onsubmit={lookupPlayer}>
    <input
      type="text"
      placeholder="Player code"
      bind:value={playerCode}
      disabled={searching}
    />
    <button type="submit" disabled={searching || !playerCode.trim()}>Go</button>
    {#if playerMessage}
      <span>{playerMessage}</span>
    {/if}
  </form>
  <LogoutButton redirectTo="/admin/login" />
</nav>
{@render children()}
