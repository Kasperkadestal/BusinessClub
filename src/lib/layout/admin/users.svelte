<script lang="ts">
  import { fakerSV } from "@faker-js/faker";
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
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
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
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
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
