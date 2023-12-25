<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton";
  import { selectedConversation } from "$lib/layout/user/script";
  import { onMount, afterUpdate } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { session, conversations, users } from "$lib/layout/user";

  let selectedUser: any; // Declare selectedUser here

  function selectUser(index: string) {
    selectedUserIndex = index;
    selectedUser = $users.find((user) => user.id === index);
  }

  async function fetchMessages(conversationId: number) {
    const { data: messagesData, error: messagesError } = await supabase
      .from("message")
      .select("*")
      .eq("conversation_id", conversationId);

    if (messagesError) {
      console.error("Error fetching messages:", messagesError.message);
    } else {
      const conversationIndex = $conversations.findIndex(
        (conv) => conv.id === conversationId
      );

      if (conversationIndex !== -1) {
        $conversations[conversationIndex].messages = messagesData;
      }
    }
  }

  var c = 0;

  async function getOrCreateConversationId(otherUserId: string) {
    if (c == 5) {
      return null;
    }

    const existingConversation = await $conversations.find(
      (conv) =>
        (conv.user1_id === $session.id && conv.user2_id === otherUserId) ||
        (conv.user1_id === otherUserId && conv.user2_id === $session.id)
    );

    if (existingConversation != null || existingConversation != false) {
      return existingConversation.id;
    } else {
      const { data, error } = await supabase.from("conversation").upsert([
        {
          user1_id: $session.id,
          user2_id: otherUserId,
        },
      ]);

      if (error) {
        console.error("Error upserting conversation:", error.message);
        return null;
      } else {
        c++;

        return getOrCreateConversationId(otherUserId);
      }
    }
  }

  let currentMessage = "";
  let selectedUserIndex: string | null = null;
  let selectedContactID: string | null = null;
  let chatContainer: any;

  function scrollToBottom() {
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  onMount(async () => {
    $conversations.forEach(async (conversation) => {
      await fetchMessages(conversation.id);
    });

    scrollToBottom();
  });

  afterUpdate(() => {
    scrollToBottom();
  });

  selectedConversation.subscribe((user) => {
    console.log("USER: ", user);

    if (user != null) {
      let found;
      if ($session.id !== user.user1_id) {
        console.log("1: ", user.user1_id);
        found = $users.find((test) => test.id === user.user1_id);
        console.log("FOUND: ", found);
      } else {
        console.log("2: ", user.user2_id);
        found = $users.find((test) => test.id === user.user2_id);
        console.log("FOUND: ", found);
      }
      if (found) {
        selectedUserIndex = found.id;
        selectedUser = found;
        selectedContactID = $session.id;
      }
    }
  });

  let sortCriteria: "name" | "company" = "name";

  function sortBy(criteria: "name" | "company") {
    sortCriteria = criteria;
    $users = [...$users].sort((a, b) => (a[criteria] > b[criteria] ? 1 : -1));
  }

  async function sendMessage() {
    if (selectedUser && currentMessage.trim() !== "") {
      const conversationId = await getOrCreateConversationId(selectedUser.id);

      if (conversationId !== null) {
        const { data, error } = await supabase.from("message").upsert([
          {
            conversation_id: conversationId,
            from_user: $session.id,
            to_user: selectedUser.id,
            content: currentMessage.trim(),
          },
        ]);

        if (error) {
          console.error("Error sending message:", error.message);
        } else {
          currentMessage = "";
          await fetchMessages(conversationId);
        }
      } else {
        console.error("Error getting or creating conversation.");
      }
    }
  }
</script>

<!-- The rest of your HTML remains unchanged -->

<div class="grid h-[80vh] grid-cols-6 gap-4 mt-10">
  <div class="w-full h-full col-span-2 overflow-y-scroll bg-black/[.25] p-2">
    <div class="w-full h-full">
      <aside>
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
          {#if users}
            {#each $users as contact (contact.id)}
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
                      <p class="font-bold">
                        {contact.first_name}
                        {contact.last_name}
                      </p>
                      <p class="text-sm opacity-75">{contact.company}</p>
                    </div>
                  </div>
                </button>
              </li>
            {/each}
          {/if}
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
        {#if selectedUserIndex != null && $conversations.length > 0}
          <div class="chat-box">
            {#each $conversations as conversation}
              {#if conversation.messages != undefined}
                {#each conversation.messages as message}
                  <div
                    class="flex py-2 {message.from_user !== $session.id
                      ? 'justify-end'
                      : 'justify-start'}"
                  >
                    <div
                      class="p-4 space-y-2 rounded-tl-none card {message.from_user !==
                      $session.id
                        ? '!bg-surface-800'
                        : '!bg-surface-600'} !max-w-[2/3]"
                    >
                      <div class="flex items-center">
                        {#if selectedUser}
                          <p class="font-bold mr-4">
                            {message.from_user === $session.id
                              ? "Jag"
                              : selectedUser.first_name +
                                " " +
                                selectedUser.last_name}
                          </p>
                        {/if}
                        <small class="opacity-50">{message.created_at}</small>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                {/each}
              {/if}
            {/each}
          </div>
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
            <button class="variant-filled-primary" on:click={sendMessage}
              >Skicka</button
            >
          </div>
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
