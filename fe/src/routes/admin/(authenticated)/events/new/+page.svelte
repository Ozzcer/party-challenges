<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminPost, ApiError } from '$lib/api';

  let error = $state<string | null>(null);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    error = null;

    try {
      await adminPost('/events', {
        name: formData.get('name'),
        description: formData.get('description'),
        current: formData.get('current') === 'on',
      });
      goto('/admin/events');
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Something went wrong';
    }
  }
</script>

<h1>New event</h1>
<a href="/admin/events">Back</a>

<form onsubmit={submit}>
  <label>
    Name
    <input name="name" type="text" required />
  </label>
  <label>
    Description
    <input name="description" type="text" required />
  </label>
  <label>
    <input name="current" type="checkbox" />
    Set as current event
  </label>
  <button type="submit">Create</button>
  {#if error}
    <span>{error}</span>
  {/if}
</form>
