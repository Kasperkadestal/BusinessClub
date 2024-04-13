<script lang="ts">
    // Import necessary libraries
    import { supabase } from "$lib/supabaseClient";
    import { onMount } from "svelte";

    let selectedEventTitle = "";
    let selectedEventText = "";
  
    let events: Array<{ title: string; text: string; date: string; id: number }> = [];

    function selectEvent(selected: { title: string; text: string; id: number }) {
      selectedEventTitle = selected.title;
      selectedEventText = selected.text;
    }
  
    onMount(async () => {
      const { data, error } = await supabase
        .from("event")
        .select("id, title, text, date");
  
      if (error) {
        console.error("Error fetching events:", error);
      } else {
        events = data ?? [];
      }
    });
</script>

<div class="grid h-[70vh] grid-cols-6 gap-4">
  <div class="col-span-2 overflow-y-scroll bg-black/[.25] p-2">
    <aside>
      <ul>
        {#each events as event}
          <li>
            <button
              class="btn btn-md variant-ghost-surface w-full rounded-none mb-2
               {selectedEventTitle === event.title ? '!bg-primary-800' : ''}"
              on:click={() => {
                selectEvent(event);
              }}
            >
              <div class="grid grid-cols-5 w-full">
                <div class="col-span-3 text-left">
                  {event.title}
                </div>
                <div class="col-span-1 text-right">
                  {event.date}
                </div>
              </div>
            </button>
          </li>
        {/each}
      </ul>
    </aside>
  </div>
  <div class="col-span-4 overflow-y-scroll bg-black/[.25] p-2">
    <section>
      {#if selectedEventTitle !== ""}
        <div>
          <h2>{selectedEventTitle}</h2>
          <p>{selectedEventText}</p>
        </div>
      {:else}
        <div class="flex h-full justify-center items-center">
          <p class="text-center">
            Select an event to view details.
          </p>
        </div>
      {/if}
    </section>
  </div>
</div>
