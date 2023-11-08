<script>
  import Chat from "$lib/layout/chat.svelte";
  import DahboardTable from "$lib/layout/dahboardTable.svelte";
  import EventCarousel from "$lib/layout/eventCarousel.svelte";
  import MessageTable from "$lib/layout/messageTable.svelte";
  import { selectedPage } from "$lib/layout/script";

</script>

{#if $selectedPage == 0}
  <EventCarousel />
  <div class="w-11/12 grid grid-cols-2 mx-auto mt-8 gap-8">
    <MessageTable />
    <DahboardTable />
  </div>
{:else if $selectedPage == 1}
  <div class="w-11/12 mt-8 m-auto">
    <Chat />
  </div>
{:else}
  <div class="w-11/12 mt-8 m-auto">
    <DahboardTable />
  </div>
{/if}
