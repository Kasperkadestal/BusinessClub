<script lang="ts">
  import {
    ListBox,
    ListBoxItem,
    type ModalSettings,
    type PopupSettings,
    popup,
  } from "@skeletonlabs/skeleton";
  import { Modal, getModalStore } from "@skeletonlabs/skeleton";
  import { users } from "../user";
  import { supabase } from "$lib/supabaseClient";

  let selectedMembers: any[] = [];
  let members = $users;
  let newUser = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    company: "",
    website: "",
  };

  sortMembersAlphabetically();

  function sortMembersAlphabetically() {
    members = [...members].sort((a, b) => {
      const nameA = `${a.first_name} ${a.last_name}`;
      const nameB = `${b.first_name} ${b.last_name}`;
      return nameA.localeCompare(nameB);
    });
  }

  // Temporary variables for the input fields
  let tempFirstName = "";
  let tempLastName = "";
  let tempCompany = "";
  let tempWebsite = "";

  // Function to update temporary variables based on the selected member
  function updateTempVariables() {
    if (selectedMembers.length > 0 && selectedMembers[0]) {
      tempFirstName = selectedMembers[0].first_name || "";
      tempLastName = selectedMembers[0].last_name || "";
      tempCompany = selectedMembers[0].company || "";
      tempWebsite = selectedMembers[0].website || "";
    } else {
      tempFirstName = "";
      tempLastName = "";
      tempCompany = "";
      tempWebsite = "";
    }
  }

  // Call updateTempVariables whenever selectedMembers changes
  $: selectedMembers, updateTempVariables();

  // Adjust your editUser function to use the temporary variables
  async function editUser() {
    if (selectedMembers.length !== 1) {
      console.error("No user selected or multiple users selected.");
      return;
    }

    const userToUpdate = selectedMembers[0];

    const { data, error } = await supabase
      .from("profile")
      .update({
        first_name: tempFirstName,
        last_name: tempLastName,
        company: tempCompany,
        website: tempWebsite,
      })
      .match({ id: userToUpdate.id });

    if (error) {
      console.error("Error updating profile:", error.message);
      return;
    }

    console.log(userToUpdate);
    console.log(data);
    console.log($users);

    // Update the local members list
    const updatedMemberIndex = members.findIndex(
      (member) => member.id === userToUpdate.id
    );
    if (updatedMemberIndex !== -1) {
      members[updatedMemberIndex] = {
        ...members[updatedMemberIndex],
        id: userToUpdate.id,
        first_name: tempFirstName,
        last_name: tempLastName,
        company: tempCompany,
        website: tempWebsite,
      };
      // Trigger reactive updates if needed
      members = [...members];
    }

    // Clear selectedMembers after successful update and local list refresh
    selectedMembers = [];

    // Clear temp variables after successful update
    tempFirstName = "";
    tempLastName = "";
    tempCompany = "";
    tempWebsite = "";

    users.set(members);
  }

  async function addUser() {
    // Create user in Supabase
    const { data: userdata, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
    });

    if (error) {
      console.error("Error creating user:", error.message);
      return;
    }

    // Create profile in Supabase
    const { data, error: profileError } = await supabase
      .from("profile")
      .upsert([
        {
          id: userdata.user?.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          company: newUser.company,
          website: newUser.website,
        },
      ]);

    if (profileError) {
      console.error("Error creating profile:", profileError.message);
      return;
    }

    // Update the list of users
    members = [
      ...members,
      {
        id: userdata.user?.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        company: newUser.company,
        website: newUser.website,
      },
    ];

    users.set(members);

    // Clear input fields
    newUser = {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      company: "",
      website: "",
    };
  }

  const popupClickU: PopupSettings = {
    event: "click",
    target: "popupClickU",
    placement: "bottom-start",
  };

  const popupClickE: PopupSettings = {
    event: "click",
    target: "popupClickE",
    placement: "bottom-start",
  };

  const modalStore = getModalStore();

  const modal: ModalSettings = {
    type: "confirm",
    // Data
    title: "Bekräfta borttagning",
    body: "Vill du ta bort användaren?",
    // TRUE if confirm pressed, FALSE if cancel pressed
    response: (r: boolean) => deleteSelectedUsers(),
  };

  function confirmDeleteUser() {
    modalStore.trigger(modal);
  }

  async function deleteSelectedUsers() {
    const idsToDelete = selectedMembers.map((user) => user.id);

    const { data, error } = await supabase
      .from("profile")
      .delete()
      .in("id", idsToDelete);

    if (error) {
      console.error("Error deleting users:", error.message);
      return;
    }

    // Remove deleted users from the local members list
    members = members.filter((member) => !idsToDelete.includes(member.id));
    users.set(members);

    // Clear selectedMembers after deletion
    selectedMembers = [];
  }
</script>

<div class="h-10vh card p-8 mb-4 flex flex-row gap-8">
  <!-- svelte-ignore a11y-missing-attribute -->
  <a class="cursor-pointer" use:popup={popupClickU}>
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
  </a>
  {#if selectedMembers.length == 1}
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="cursor-pointer" use:popup={popupClickE}>
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
    </a>
  {/if}
  {#if selectedMembers.length >= 1}
  <a class="cursor-pointer" on:click={deleteSelectedUsers}>
    <svg
      class="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M16 12h4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  </a>
  {/if}
 

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
              {member.first_name}
              {member.last_name}
            </p>
            <small class="opacity-50">{member.company}</small>
          </ListBoxItem>
        {/each}
      {/if}
    </ListBox>
  {/if}
</div>

<div class="card p-8" data-popup="popupClickU">
  <label class="label text-sm mb-4">
    <input
      bind:value={newUser.email}
      class="input !rounded"
      type="text"
      placeholder="Email"
    />
  </label>
  <label class="label text-sm mb-4">
    <input
      bind:value={newUser.password}
      class="input !rounded"
      type="text"
      placeholder="Lösenord"
    />
  </label>
  <label class="label text-sm mb-4">
    <input
      bind:value={newUser.first_name}
      class="input !rounded"
      type="text"
      placeholder="Förnamn"
    />
  </label>
  <label class="label text-sm mb-4">
    <input
      bind:value={newUser.last_name}
      class="input !rounded"
      type="text"
      placeholder="Efternamn"
    />
  </label>
  <label class="label text-sm mb-4">
    <input
      bind:value={newUser.company}
      class="input !rounded"
      type="text"
      placeholder="Företag"
    />
  </label>
  <label class="label text-sm mb-4">
    <input
      bind:value={newUser.website}
      class="input !rounded"
      type="text"
      placeholder="Webbsida"
    />
  </label>

  <button
    class="btn btn-md variant-ghost-primary rounded-sm h-full w-full"
    on:click={addUser}
  >
    Lägg till
  </button>
</div>

<div class="card p-8" data-popup="popupClickR"></div>

<div class="card p-8" data-popup="popupClickE">
  <!-- Bind input fields to temporary variables instead -->
  <label class="label text-sm mb-4">
    <input
      bind:value={tempFirstName}
      class="input !rounded"
      type="text"
      placeholder="Förnamn"
    />
  </label>
  <label class="label text-sm mb-4">
    <input
      bind:value={tempLastName}
      class="input !rounded"
      type="text"
      placeholder="Efternamn"
    />
  </label>
  <label class="label text-sm mb-4">
    <input
      bind:value={tempCompany}
      class="input !rounded"
      type="text"
      placeholder="Företag"
    />
  </label>
  <label class="label text-sm mb-4">
    <input
      bind:value={tempWebsite}
      class="input !rounded"
      type="text"
      placeholder="Webbsida"
    />
  </label>

  <button
    class="btn btn-md variant-ghost-primary rounded-sm h-full w-full"
    on:click={editUser}
  >
    Spara
  </button>
</div>
