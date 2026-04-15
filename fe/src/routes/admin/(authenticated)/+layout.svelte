<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  let { children } = $props();
</script>
<nav>
  <a href="/admin">Home</a>
  <a href="/admin/events">Events</a>
  <LogoutButton redirectTo="/admin/login" />
</nav>
{@render children()}