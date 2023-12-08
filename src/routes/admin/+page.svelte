<script lang="ts">
    import Chat from "$lib/layout/admin/chat.svelte";
    import CreateNews from "$lib/layout/admin/createNews.svelte";
    import DahboardTable from "$lib/layout/admin/dahboardTable.svelte";
    import Invoices from "$lib/layout/admin/invoices.svelte";
    import MessageTable from "$lib/layout/admin/messageTable.svelte";
    import News from "$lib/layout/admin/news.svelte";
    import Raffle from "$lib/layout/admin/raffle/raffle.svelte";
    import { selectedPage } from "$lib/layout/admin/script";
    import Users from "$lib/layout/admin/users.svelte";
    import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  </script>
  
  {#if $selectedPage == 0}
  <div class="w-11/12 grid grid-cols-2 mx-auto mt-8 gap-8">
    <MessageTable />
    <DahboardTable />
  </div>
  {:else if $selectedPage == 1}
    <div class="w-11/12 mt-8 m-auto">
      <Chat />
    </div>
  {:else if $selectedPage == 2}
    <div class="w-11/12 mt-8 m-auto">
      <Accordion autocollapse>
        <AccordionItem open>
          <svelte:fragment slot="lead">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </svelte:fragment>
          <svelte:fragment slot="summary">Utskick</svelte:fragment>
          <svelte:fragment slot="content"><CreateNews /></svelte:fragment>
        </AccordionItem>
        <AccordionItem>
          <svelte:fragment slot="lead">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </svelte:fragment>
        
          
          <svelte:fragment slot="summary">Historik</svelte:fragment>
          <svelte:fragment slot="content"><News /></svelte:fragment>
        </AccordionItem>
      </Accordion>
    </div>
  {:else if $selectedPage == 3}
    <div class="w-11/12 mt-8 m-auto">
      <Invoices />
    </div>
  {:else if $selectedPage == 4}
    <div class="w-11/12 mt-8 m-auto">
      <Users />
    </div>
    {:else if $selectedPage == 5}
    <div class="w-11/12 mt-8 m-auto">
      <Raffle />
    </div>
  {/if}
  