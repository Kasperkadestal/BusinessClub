<script lang="ts">
  // Import necessary libraries
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { selectedNews } from "$lib/layout/admin/script";

  let selectedNewsTitle = "";
  let selectedNewsDescription = "";

  selectedNews.subscribe((news) => {
    selectedNewsTitle = news.title;
    selectedNewsDescription = news.description;
  });

  let sourceData: {
    news: Array<{ title: string; description: string; created_at: string }>;
  } = {
    news: [],
  };

  function selectNews(selected: { title: string; description: string }) {
    selectedNewsTitle = selected.title;
    selectedNewsDescription = selected.description;
  }

  onMount(async () => {
    const { data, error } = await supabase.from("news").select();

    console.log(data);

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      // Generate random text for each news item's description
      sourceData.news =
        data?.map((newsItem) => ({
          ...newsItem,
        })) ?? [];
    }
  });
</script>

<div class="grid h-[70vh] grid-cols-6 gap-4">
  <div class="w-full h-full col-span-2 overflow-y-scroll bg-black/[.25] p-2">
    <div class="w-full h-full">
      <aside>
        <ul>
          {#each sourceData.news as news}
            <li>
              <button
                class="btn btn-md variant-ghost-surface w-full rounded-none mb-2
                 {selectedNewsTitle === news.title ? '!bg-primary-800' : ''}"
                on:click={() => {
                  selectNews(news);
                }}
              >
                <div class="grid grid-cols-5 w-full">
                  <div class="col-span-4 text-left">
                    {news.title}
                  </div>
                </div>
              </button>
            </li>
          {/each}
        </ul>
      </aside>
    </div>
  </div>
  <div
    class="w-full col-span-4 w-full h-full overflow-y-scroll bg-black/[.25] p-2"
  >
    <div>
      <section>
        {#if selectedNewsTitle !== ""}
          <div class="">
            <img
              src="https://www.visma.se/contentassets/6f475b19055a48008c1500a9d979e05d/13_01_08-vsm1152-a.jpg?width=1920&mode=crop&heightratio=0.34375&quality=85"
              alt=""
            />
            <div class="p-8">
              <h2 class="mt-4">{selectedNewsTitle}</h2>
              <p class="mt-2">{selectedNewsDescription}</p>
            </div>
          </div>
        {:else}
          <div class="flex h-[60vh] justify-center items-center">
            <p class="text-center">
              Select a contact or click "New Contact" to start a conversation.
            </p>
          </div>
        {/if}
      </section>
    </div>
  </div>
</div>
