<script lang="ts">
  import { goto } from '$app/navigation';

  let { redirectTo }: { redirectTo: string } = $props();

  async function logout() {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    goto(redirectTo);
  }
</script>

<button onclick={logout}>Logout</button>
