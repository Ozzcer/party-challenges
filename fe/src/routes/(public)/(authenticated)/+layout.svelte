<script lang="ts">
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  let { children } = $props();
</script>
<nav>
  <LogoutButton redirectTo="/login" />
</nav>

{@render children()}
