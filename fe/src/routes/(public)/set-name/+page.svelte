<script lang="ts">
  import { goto } from '$app/navigation';
  import { publicPatch } from '$lib/api';

  let error = $state<string | null>(null);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    error = null;

    try {
      await publicPatch('/me/name', { name: data.get('name') });
      goto('/');
    } catch (err) {
      error = (err as Error).message;
    }
  }
</script>

<h1>Set your name</h1>
<form onsubmit={submit}>
  <input name="name" type="text" placeholder="Enter your name" />
  <button>Continue</button>
  {#if error}
    <span>{error}</span>
  {/if}
</form>
