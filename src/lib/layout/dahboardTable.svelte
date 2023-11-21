<script lang="ts">
  // Import necessary libraries
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { selectedNews, selectedPage } from "./script";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

  let sourceData: {
    news: Array<{ title: string; description: string; created_at: string }>;
  } = {
    news: [],
  };

  onMount(async () => {
    const { data, error } = await supabase.from("news").select();

    console.log(data);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      sourceData.news = data ?? [];
    }
  });

  // Define the number of items to display per page
  const itemsPerPage = 4;
  let currentPage = 0;

  // Calculate the total number of pages
  $: totalPages = Math.ceil(sourceData.news.length / itemsPerPage);

  // Function to change the current page
  function changePage(newPage: any) {
    currentPage = newPage;
  }

  function selectNews(news: {
    title: string;
    description: string;
    created_at: string;
  }) {
    selectedNews.set(news);
    selectedPage.set(2);
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
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </svelte:fragment>
      <svelte:fragment slot="summary">Nyheter</svelte:fragment>
      <svelte:fragment slot="content">
        <table class="table table-hover">
          <tbody>
            {#each sourceData.news.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) as row, i}
              <tr
                on:click={() => selectNews(row)}
                class="opacity-70 cursor-pointer"
              >
                <td><b>{row.title}</b></td>
                <td>{row.description}</td>
                <td class="text-right">{row.created_at}</td>
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
