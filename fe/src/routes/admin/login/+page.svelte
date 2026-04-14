<script lang="ts">
  import { goto } from '$app/navigation';
  import { apiPost } from '$lib/api';

  let error = $state<string | null>(null);

  async function submit(e: SubmitEvent) {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    error = null;

    try {
      await apiPost('/admin/login', {
        username: data.get('username'),
        password: data.get('password'),
      });
      goto('/admin');
    } catch (err) {
      error = (err as Error).message;
    }
  }
</script>

<h1>Admin login</h1>
<form id="login-form" onsubmit={submit}>
  <input name="username" type="text" />
  <input name="password" type="password" />
  <button>Login</button>
  {#if error}
    <span>{error}</span>
  {/if}
</form>