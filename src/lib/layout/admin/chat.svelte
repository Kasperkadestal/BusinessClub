<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton";
  import { selectedConversation } from "$lib/layout/admin/script";
  import { onMount, afterUpdate } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { session } from "$lib/layout/user";

  let users = <any>[];
  let conversations = <any>[];
  async function fetchUsers() {
    const { data, error } = await supabase.from("profile").select("*");
    console.log(data);
    
    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      console.log($session);
      
      users = data.filter(contact => contact.id !== $session.id);
    }
  }

  onMount(() => {
    fetchUsers();
  });

  let currentMessage = "";

  let selectedUser: any;

  // Function to select a contact and load messages
  function selectContact(contact: { userID: number; name: string } | null) {
    selectedUser = contact;
    // Fetch messages for the selected contact from your data source
    // You can use an API call here or any other data source
    // Update the 'messages' variable with the retrieved messages
  }

  let selectedUserIndex: string | null = null; // Track the selected user's index

  function selectUser(index: string) {
    selectedUserIndex = index;
  }

  let selectedContactID: number | null = null;
  let chatContainer: any;

  function scrollToBottom() {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  onMount(() => {
    scrollToBottom();
  });

  afterUpdate(() => {
    scrollToBottom();
  });

  selectedConversation.subscribe((user) => {
    if (user != null) {
      selectUser(user.id);
      selectedContactID = $session.id;
    }
  });

  let sortCriteria: "name" | "company" = "name";

  function sortBy(criteria: "name" | "company") {
    sortCriteria = criteria;
    users = [...users].sort((a, b) => (a[criteria] > b[criteria] ? 1 : -1));
  }
</script>

<div class="grid h-[80vh] grid-cols-6 gap-4 mt-10">
  <div class="w-full h-full col-span-2 overflow-y-scroll bg-black/[.25] p-2">
    <div class="w-full h-full">
      <aside>
        <button
          class="btn btn-md variant-ghost-primary mb-2 rounded-none w-full"
          on:click={() => selectContact(null)}
        >
          <p>Nytt meddelande</p>
        </button>
        <div class="flex space-x-2 mb-2">
          <button
            class="btn btn-sm variant-ghost-tertiary rounded-none w-1/2"
            on:click={() => sortBy("name")}
          >
            Sortera efter namn
          </button>
          <button
            class="btn btn-sm variant-ghost-tertiary rounded-none w-1/2"
            on:click={() => sortBy("company")}
          >
            Sortera efter företag
          </button>
        </div>
        <ul>
          {#each users as contact (contact.id)}
            <li>
              <button
                class="btn btn-md variant-ghost-surface w-full rounded-none mb-2
              {selectedContactID === contact.id ? '!bg-primary-800' : ''}"
                on:click={() => selectUser(contact.id)}
              >
                <div class="grid grid-cols-5 w-full">
                  <div>
                    <Avatar
                      src="https://www.shareicon.net/download/2016/07/05/791214_man_512x512.png"
                      width="w-8 mt-2"
                      rounded="rounded-full"
                    />
                  </div>
                  <div class="col-span-3 text-left">
                    <p class="font-bold">{contact.first_name} {contact.last_name}</p>
                    <p class="text-sm opacity-75">{contact.company}</p>
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
    bind:this={chatContainer}
  >
    <div>
      <section>
        {#if selectedUserIndex != null}
          {#if conversations[selectedUserIndex]}
            <div class="chat-box">
              {#each conversations[selectedUserIndex].messages as message}
                <div
                  class="flex py-2 {message.from_user !== $session.id
                    ? 'justify-end'
                    : 'justify-start'}"
                >
                  <div
                    class="p-4 space-y-2 rounded-tl-none card
        {message.from_user !== $session.id
                      ? '!bg-surface-800'
                      : '!bg-surface-600'} !max-w-[2/3]"
                  >
                    <div class="flex items-center">
                      <p class="font-bold mr-4">
                        {message.fromUserID === 99
                          ? "Jag"
                          : users.find(
                              (user) => user.id === message.from_user
                            )?.name}
                      </p>
                      <small class="opacity-50"
                        >{message.date.toLocaleDateString()}</small
                      >
                    </div>
                    <p>{message.content}</p>
                  </div>
                </div>
              {/each}
              <div
                class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token my-4"
              >
                <button class="input-group-shim">+</button>
                <textarea
                  bind:value={currentMessage}
                  class="bg-transparent border-0 ring-0"
                  name="prompt"
                  id="prompt"
                  placeholder="Skriv ett meddelande..."
                  rows="1"
                />
                <button class="variant-filled-primary">Skicka</button>
              </div>
            </div>
          {/if}
        {:else}
          <div class="flex h-[75vh] justify-center items-center">
            <p class="text-center">
              Välj en kontakt eller klicka "Ny kotakt" för att påbörja en
              konversation.
            </p>
          </div>
        {/if}
      </section>
    </div>
  </div>
</div>
