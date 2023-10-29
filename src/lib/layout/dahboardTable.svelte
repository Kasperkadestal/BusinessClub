<script lang="ts">
  // Import necessary libraries
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  let sourceData: { meeting: Array<{ date: string; description: string }> } = {
    meeting: [],
  };

  onMount(async () => {
    const { data, error } = await supabase
      .from("meeting")
      .select("date, description");

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      sourceData.meeting = data ?? [];
    }
  });

  // Make tableSimple reactive to changes in sourceData.meeting
  let tableSimple: any;

  $: {
    tableSimple = sourceData.meeting.map(row => {
      // Parse the timestamp date
      const timestampDate = new Date(row.date);
      const currentDate = new Date();
      
      // Calculate the number of days until the timestamp date
      const timeDifference = timestampDate.getTime() - currentDate.getTime();
      const daysUntil = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      return {
        date: `${daysUntil} dagar`,
        description: row.description,
      };
    });
  }
</script>

<div class="table-container">
  <!-- Native Table Element -->
  <table class="table table-hover">
    <thead>
      <tr>
        <th class="w-1/5">Möten</th>
        <th class="w-1/5 text-right"><button><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button></th>
      </tr>
    </thead>
    <tbody>
      {#each tableSimple as row, i}
        <tr>
          <td class="w-1/5">{row.date}</td>
          <td class="w-4/5">{row.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
