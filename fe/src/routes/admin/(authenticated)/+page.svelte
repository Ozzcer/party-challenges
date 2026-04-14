<script lang="ts">
  import { onMount } from 'svelte';
  import { adminGet, ApiError } from '$lib/api';

  let overview = $state<{ playerCount: number; challengeCount: number; challengeInstanceCount: number } | null>(null);

  onMount(async () => {
    const result = await adminGet<typeof overview>('/overview');
    if (!(result instanceof ApiError)) {
      overview = result;
    }
  });
</script>

<h1>Admin landing</h1>
<pre>{JSON.stringify(overview, null, 2)}</pre>
