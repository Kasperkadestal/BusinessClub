<script lang="ts">
  import {
    Table,
    tableMapperValues,
    type TableSource,
  } from "@skeletonlabs/skeleton";

  // Supabase
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  let sourceData: { meeting: Array<{ date: string, description: string }> } = {
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
  let tableSimple: TableSource;

  $: {
    tableSimple = {
      // A list of heading labels.
      head: ["Möten", ""],
      // The data visibly shown in your table body UI.
      body: tableMapperValues(sourceData.meeting, ["date", "description"]),
      // Optional: The data returned when interactive is enabled and a row is clicked.
      meta: tableMapperValues(sourceData.meeting, ["date", "description"]),
    };
  }
</script>

<Table source={tableSimple} />
