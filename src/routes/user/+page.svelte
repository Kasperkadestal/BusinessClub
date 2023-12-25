<script>
  import Chat from "$lib/layout/user/chat.svelte";
  import DahboardTable from "$lib/layout/user/dahboardTable.svelte";
  import EventCarousel from "$lib/layout/user/eventCarousel.svelte";
  import MessageTable from "$lib/layout/user/messageTable.svelte";
  import News from "$lib/layout/user/news.svelte";
  import { selectedPage } from "$lib/layout/user/script";

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
    <News />
  </div>
{/if}
