<script lang="ts">
  import {
    storedUsers,
    selectedPage,
    selectedConversation,
  } from "$lib/layout/admin/script";
  import { faker } from "@faker-js/faker/locale/af_ZA";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

  // Define the number of items to display per page
  const itemsPerPage = 4;
  let currentPage = 0;

  // Calculate the total number of pages
  $: totalPages = Math.ceil(storedUsers.length / itemsPerPage);

  // Function to change the current page
  function changePage(newPage: any) {
    currentPage = newPage;
  }

  function selectMessage(message: { userID: number; name: string }) {
    selectedConversation.set(message);
    selectedPage.set(1);
  }
</script>

<div class="table-container card !bg-surface-800/50 h-fit">
  <!-- Native Table Element -->
  <Accordion>
    <AccordionItem padding="px-4 py-4">
      <svelte:fragment slot="lead"
        ><svg
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
            d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
          />
        </svg>
      </svelte:fragment>
      <svelte:fragment slot="summary">Meddelanden</svelte:fragment>
      <svelte:fragment slot="content">
        <table class="table table-hover">
          <tbody>
            {#each storedUsers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) as row}
              <tr
                on:click={() => selectMessage(row)}
                class="opacity-70 cursor-pointer"
              >
                <td><b>{row.name}</b></td>
                <td class="text-right"
                  >{faker.date.recent().toLocaleString()}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
        <!-- Pagination Controls -->
        <div class="pagination flex justify-end">
          {#if totalPages > 1}
            {#each Array.from({ length: totalPages }, (_, i) => i) as page}
              <a
                class="btn btn-sm rounded-md variant-ghost-surface cursor-pointer opacity-30 mt-2 mr-2"
                class:active={page === currentPage}
                on:click={() => changePage(page)}
              >
                {page + 1}
              </a>
            {/each}
          {/if}
        </div>
      </svelte:fragment>
    </AccordionItem>
  </Accordion>
</div>
