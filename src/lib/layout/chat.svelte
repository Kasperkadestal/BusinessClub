<script lang="ts">
  import { faker } from "@faker-js/faker";
  import { Avatar } from "@skeletonlabs/skeleton";
  import { storedUsers } from "$lib/layout/script";
  import { onMount, afterUpdate } from "svelte";

  // Function to generate fake messages for a conversation
  function generateFakeMessages(
    count: number,
    fromUser: number,
    toUser: number
  ) {
    const fakeMessages = [];
    for (let i = 0; i < count; i++) {
      const sender = i % 2 === 0 ? fromUser : toUser;
      const receiver = i % 2 === 0 ? toUser : fromUser;

      fakeMessages.push({
        fromUserID: sender,
        toUserID: receiver,
        date: faker.date.recent(),
        content: faker.lorem.sentence(),
      });
    }
    return fakeMessages;
  }

  let currentMessage = "";
  let users: Array<{ userID: number; name: string }> = storedUsers;
  let selectedUser: { userID: number; name: string } | null = null;
  let conversations: Array<{
    user: { userID: number; name: string };
    messages: Array<{
      fromUserID: number;
      toUserID: number;
      date: Date;
      content: string;
    }>;
  }> = [];

  // Generate 5 conversations
  for (let i = 0; i < storedUsers.length; i++) {
    const fromUser = users[i].userID;
    const toUser = 99;

    conversations.push({
      user: users[i],
      messages: generateFakeMessages(10, fromUser, toUser),
    });
  }

  // Function to select a contact and load messages
  function selectContact(contact: { userID: number; name: string } | null) {
    selectedUser = contact;
    // Fetch messages for the selected contact from your data source
    // You can use an API call here or any other data source
    // Update the 'messages' variable with the retrieved messages
  }

  let selectedUserIndex: number | null = null; // Track the selected user's index

  function selectUser(index: number) {
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
</script>

<div class="grid h-[80vh] grid-cols-6 gap-4 mt-10">
  <div class="w-full h-full col-span-2 overflow-y-scroll bg-black/[.25] p-2">
    <div class="w-full h-full">
      <aside>
        <button
          class="btn btn-md variant-ghost-primary mb-4 rounded-none w-full"
          on:click={() => selectContact(null)}
        >
          <p>New Contact</p>
        </button>
        <ul>
          {#each users as contact (contact.userID)}
            <li>
              <button
                class="btn btn-md variant-ghost-surface w-full rounded-none mb-2
             {selectedContactID === contact.userID ? '!bg-primary-800' : ''}"
                on:click={() => {
                  selectUser(contact.userID);
                  selectedContactID = contact.userID;
                }}
              >
                <div class="grid grid-cols-5 w-full">
                  <div>
                    <Avatar
                      src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
                      width="w-6"
                      rounded="rounded-full"
                    />
                  </div>
                  <div class="col-span-4 text-left">
                    {contact.name}
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
        {#if selectedUserIndex !== null}
          {#if conversations[selectedUserIndex]}
            <div class="chat-box">
              {#each conversations[selectedUserIndex].messages as message}
                <div
                  class="flex py-2 {message.fromUserID === 99
                    ? 'justify-end'
                    : 'justify-start'}"
                >
                  <div
                    class="p-4 space-y-2 {message.fromUserID === 99
                      ? 'rounded-tr-none'
                      : 'rounded-tl-none'} card
        {message.fromUserID === 99
                      ? '!bg-surface-800'
                      : '!bg-surface-600'} !max-w-[2/3]"
                  >
                    <div class="flex items-center">
                      <p class="font-bold mr-4">
                        {message.fromUserID === 99
                          ? "You"
                          : users.find(
                              (user) => user.userID === message.fromUserID
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
                  placeholder="Write a message..."
                  rows="1"
                />
                <button class="variant-filled-primary">Send</button>
              </div>
            </div>
          {/if}
        {:else}
          <div class="flex h-[75vh] justify-center items-center">
            <p class="text-center">
              Select a contact or click "New Contact" to start a conversation.
            </p>
          </div>
        {/if}
      </section>
    </div>
  </div>
</div>
