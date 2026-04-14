<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<h1>Admin landing</h1>
<pre>{JSON.stringify(data.overview, null, 2)}</pre>
