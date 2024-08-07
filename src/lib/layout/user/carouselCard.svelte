<script lang="ts">
  import {
    Avatar,
    RadioGroup,
    RadioItem,
    popup,
    type PopupSettings,
    Accordion,
    AccordionItem,
  } from "@skeletonlabs/skeleton";

  import { supabase } from "$lib/supabaseClient";
  import { session } from "../user";

  let valueG: number = 1;

  let newGuestInfo: { name: string; company: string };
  newGuestInfo = { name: "", company: "" };

  export let counter: number;
  export let eventInfo: { title: string; text: string; date: any; id: string };
  export let guestInfo: { name: string } | null;
  export let value: number;
  let isInitialized = false; 

  function generatePopupSettings(target: string): PopupSettings {
    return {
      event: "click",
      target,
      placement: "bottom-start",
    };
  }

  const popupClickI: PopupSettings = {
    event: "click",
    target: "popupClickI",
    placement: "bottom-start",
  };

  let popupClickG: PopupSettings;
  popupClickG = generatePopupSettings(("popupClickG"+counter));

  function addGuest() {
    // Check if newGuestInfo has been filled with the necessary information
    if (newGuestInfo && newGuestInfo.name && newGuestInfo.company) {
      // Use supabase client to add the new guest to the database
      supabase
        .from("guest")
        .upsert([
          {
            uid: $session.id,
            eid: eventInfo.id, // Assuming you have the eventInfo available
            name: newGuestInfo.name,
            company: newGuestInfo.company,
          },
        ])
        .then(({ data, error }) => {
          if (error) {
            console.error("Error adding guest:", error.message);
          } else {
            // Set guestInfo to the newly added guest
            guestInfo = {name: newGuestInfo.name};
            // Reset newGuestInfo
            newGuestInfo = { name: "", company: "" };
          }
        });
    } else {
      console.error("Incomplete guest information");
    }
  }

  function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((d.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7
    );
    return weekNo;
  }


  // Reactive statement to handle RadioItem selection
  $: if (value !== undefined) {
    if (isInitialized) {
      console.log("value :", value);
      
      upsertParticipant($session.id, eventInfo.id, value);
    }
    isInitialized = true;
  }

  // Function to insert or update the participant's status in the database
  // Function to insert or update the participant's status in the database
async function upsertParticipant(userId: string, eventId: string, newStatus: number) {
  if (!userId || !eventId) return; // Ensure userId and eventId are valid

  // Fetch current status from the database for comparison
  const { data: existingParticipants, error: selectError } = await supabase
    .from('participant')
    .select('status')
    .match({ uid: userId, eid: eventId })
    .single();

  if (selectError) {
    console.error('Error checking for existing participant:', selectError.message);
    return;
  }

  // Proceed with update only if the status has changed
  if (existingParticipants && existingParticipants.status !== newStatus) {
    
    const { error: updateError } = await supabase
      .from('participant')
      .update({ status: newStatus })
      .match({ uid: userId, eid: eventId });

    if (updateError) {
      console.error('Error updating participant status:', updateError.message);
    } else {
      console.log('Participant status updated successfully');      
    }
  } else if (!existingParticipants) {
    // If participant does not exist, insert a new one
    const { error: insertError } = await supabase
      .from('participant')
      .insert([
        { uid: userId, eid: eventId, status: newStatus }
      ]);

    if (insertError) {
      console.error('Error adding new participant:', insertError.message);
    } else {
      console.log('New participant added successfully');
    }
  }
}

</script>

<div class="shrink-0 w-[28%] h-fit !bg-surface-900 card snap-start text-center">
  <div class="flex px-6 bg-primary-800 items-center">
    <div class="h-12 w-full flex items-center justify-center">
      <p class="text-left">
        <b>Vecka {getWeekNumber(new Date(eventInfo.date))}</b>
      </p>
    </div>
  </div>
  <RadioGroup rounded="none" display="flex">
    <RadioItem
    active="variant-filled-error"
    hover="hover:variant-soft-error"
    bind:group={value}
    name="justify"
    value={0}
  >
    <div class="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 inline-block"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </RadioItem>
    <RadioItem
      active="variant-filled-warning"
      hover="hover:variant-soft-warning"
      bind:group={value}
      name="justify"
      value={1}
    >
      <div class="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 inline-block"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
      </div>
    </RadioItem>
    <RadioItem
    active="variant-filled-success"
    hover="hover:variant-soft-success"
    bind:group={value}
    name="justify"
    value={2}
  >
    <div class="text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 inline-block"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  </RadioItem>
  </RadioGroup>
  <div>
    <div class="opacity-60">
      <Accordion>
        <AccordionItem padding="px-6 py-3">
          <svelte:fragment slot="summary">Information</svelte:fragment>

          <svelte:fragment slot="content">
            <p>
              {eventInfo.text}
            </p></svelte:fragment
          >
        </AccordionItem>
        <AccordionItem padding="px-6 py-3">
          <svelte:fragment slot="summary">Extra</svelte:fragment>

          <svelte:fragment slot="content">
            <div class="text-left ml-4 flex justify-center mr-4">
              {#if guestInfo === null}
                <!-- svelte-ignore a11y-missing-attribute -->
                <a
                  class="btn btn-sm variant-ghost-surface opacity-60 mr-4 cursor-pointer"
                  use:popup={popupClickG}
                >
                  <Avatar
                    initials="G"
                    class="mr-2 -ml-1 h-full"
                    width="w-6"
                    background="bg-surface-700"
                  />
                  Lägg till gäst...
                </a>
              {/if}

              {#if guestInfo !== null}
                <div class="flex items-center btn btn-sm variant-ghost-surface opacity-60 mr-4">
                  <Avatar
                    initials="G"
                    class="-ml-1"
                    width="w-6"
                    height="w-6"
                    background="bg-surface-700"
                  />
                  <span class="text-white ml-2">{guestInfo.name}</span>
                </div>
              {/if}

              <!-- svelte-ignore a11y-missing-attribute -->
              <!-- <a
                class="btn btn-sm variant-ghost-surface opacity-60 cursor-pointer"
                use:popup={popupClickI}
              >
                <Avatar
                  initials="?"
                  class="mr-2 -ml-1 h-full"
                  width="w-6"
                  background="bg-surface-700"
                />

                Välj inhoppare...
              </a>
              -->
            </div>
          </svelte:fragment>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
  <div
    class="border-t border-surface-900 flex items-center justify-between px-6 pb-4 pt-4"
  >
    <p class="text-primary-500 flex items-center h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 mr-1 inline-block"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {eventInfo.date}
    </p>
  </div>
</div>

<div class="card p-8" data-popup="popupClickG{counter}">
  <label class="label text-sm mb-4">
    <input
      bind:value={newGuestInfo.name}
      class="input !rounded"
      type="text"
      placeholder="Namn"
    />
  </label>
  <label class="label text-sm mb-4">
    <input
      bind:value={newGuestInfo.company}
      class="input !rounded"
      type="text"
      placeholder="Företag"
    />
  </label>
  <div class="flex h-10 items-center mt-4">
    <RadioGroup
      display="flex"
      active="variant-filled-primary"
      hover="hover:variant-soft-primary"
    >
      <RadioItem bind:group={valueG} name="justify" value={1}
        >Gratis (5 kvar)</RadioItem
      >
      <RadioItem bind:group={valueG} name="justify" value={2}>Betala</RadioItem>
    </RadioGroup>
    <button
      class="btn btn-md variant-ghost-primary rounded-sm h-full ml-4"
      on:click={addGuest}
    >
      Lägg till
    </button>
  </div>
</div>

<!--
  <div class="card p-8" data-popup="popupClickI">
  <select class="select">
    {#each storedUsers as user, i}
      <option value={i + 1}>{user.name}</option>
    {/each}
  </select>
  <button class="btn btn-md variant-ghost-primary rounded-sm w-full mt-4">
    Lägg till
  </button>
</div>
-->
