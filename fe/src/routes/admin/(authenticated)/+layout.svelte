<script lang="ts">                                                                    
  let { children } = $props();                                         
</script>
<nav>
  <a href="/admin">Home</a>
  <a href="/admin/events">Events</a>
</nav>
{@render children()}