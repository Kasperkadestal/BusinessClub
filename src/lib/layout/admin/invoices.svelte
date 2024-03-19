<script lang="ts">
  import { ListBox, ListBoxItem } from "@skeletonlabs/skeleton";
  import { users } from "../user";

  let selectedMembers: any[] = [];
  let members = $users;

  sortMembersAlphabetically();

  function sortMembersAlphabetically() {
    members = [...members].sort((a, b) => a.name.localeCompare(b.name));
  }
</script>

<div class="h-10vh card p-8 mb-4 flex flex-row gap-8">
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
      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
    />
  </svg>
  <div class="">
    {#if selectedMembers}
      {#if selectedMembers.length == 1}
        1 markering
      {:else}
        {selectedMembers.length} markeringar
      {/if}
    {/if}
  </div>
</div>
<div class="overflow-scroll overflow-x-hidden h-[70vh] card p-8">
  {#if $users && selectedMembers}
  <ListBox multiple>
      {#if members.length > 0}
        {#each members as member, index}
          <ListBoxItem
            bind:group={selectedMembers}
            name="medium"
            active="variant-ghost-primary"
            padding="p-4"
            rounded="none"
            value={member}
            class={index % 2 === 0 ? "" : "bg-tertiary-800/10"}
          >
            <p class="text-lg">
              {member.first_name}  {member.last_name}
            </p>
            <small class="opacity-50">{member.company}</small>
          </ListBoxItem>
        {/each}
      {/if}
  </ListBox>
  {/if}
</div>

