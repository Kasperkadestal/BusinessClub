<!-- Table.svelte -->
<script lang="ts">
  export let table: {
    seats: number;
    id: number;
    participants: { name: string; key?: string }[];
  };
</script>

<div class="table w-full p-4">
  <h2 class="text-lg font-bold mb-2">Bord {table.id}</h2>
  <ul class="participants">
    {#each table.participants as participant, index (participant.key)}
      {#if participant.key}
        <li class="seat">{index + 1}. {participant.name}</li>
      {/if}
      {#if !participant.key}
        <li class="seat">{index + 1}. {participant.name} (No Key)</li>
      {/if}
    {/each}
  </ul>
</div>
