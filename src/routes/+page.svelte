<script>
  import DahboardTable from "$lib/layout/dahboardTable.svelte";
  import EventCarousel from "$lib/layout/eventCarousel.svelte";
  import MessageTable from "$lib/layout/messageTable.svelte";
</script>

<EventCarousel />
<div class="w-11/12 grid grid-cols-2 mx-auto mt-8 gap-8">
  <MessageTable />
  <DahboardTable />
</div>
