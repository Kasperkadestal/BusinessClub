<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import CarouselCard from "./carouselCard.svelte";
  import { session } from "../user";

  let elemMovies: HTMLDivElement;
  let events: any[];
  let guests: any[];
  let participants: any[];

  // Reactive statement to fetch guests and participants once $session.uid is set
  $: if ($session.id.length > 0) {
    fetchGuestsAndParticipants();
  }

  async function fetchGuestsAndParticipants() {
    await fetchGuests();
    await fetchParticipants();
  }

  async function fetchGuests() {
    return new Promise<void>(async (resolve) => {
      const { data: guestData, error: guestError } = await supabase
        .from("guest")
        .select("*");

      if (guestData) {
        guests = guestData;
      }

      if (guestError) {
        console.error("Error fetching guests:", guestError.message);
      }

      resolve();
    });
  }

  function getGuest(event: { id: string }) {
    // Check if guests is initialized and not undefined
    if (guests && guests.length > 0) {
      const matchingGuests = guests.filter(
        (guest) => guest.eid === event.id && guest.uid === $session.id
      );

      // Return the first matching guest or null if none found
      return matchingGuests.length > 0 ? matchingGuests[0] : null;
    }

    // Return null if guests is not initialized or empty
    return null;
  }

  async function fetchEvents() {
  // Get the current date and time
  const currentDate = new Date().toISOString();

  // Fetch events where the date is greater than or equal to the current date and time
  const { data: eventData, error: eventError } = await supabase
    .from("event")
    .select("*")
    .gte("date", currentDate); // .gte stands for 'greater than or equal'

  if (eventData) {
    events = eventData;
  }

  if (eventError) {
    console.error("Error fetching events:", eventError.message);
  }
}

  function multiColumnLeft(): void {
    let x = elemMovies.scrollWidth;
    if (elemMovies.scrollLeft !== 0)
      x = elemMovies.scrollLeft - elemMovies.clientWidth;
    elemMovies.scroll(x, 0);
  }

  function multiColumnRight(): void {
    let x = 0;
    // -1 is used because different browsers use different methods to round scrollWidth pixels.
    if (
      elemMovies.scrollLeft <
      elemMovies.scrollWidth - elemMovies.clientWidth - 1
    )
      x = elemMovies.scrollLeft + elemMovies.clientWidth;
    elemMovies.scroll(x, 0);
  }

  async function fetchParticipants() {
    const { data: participantData, error: participantError } = await supabase
      .from("participant")
      .select("*")
      .eq("uid", $session.id); // Filter by current user ID

    if (participantData) {
      participants = participantData;
    }

    if (participantError) {
      console.error("Error fetching participants:", participantError.message);
    }
  }

  function getParticipant(eventId: string) {

  const participant = participants.find(
    (p) => p.eid === eventId && p.uid === $session.id
  );

  // Check if a participant was found; if not, return an object with a default status of 0
  return participant ? participant.status : 0 ;
}

  onMount(async () => {
    await fetchEvents();
  });
</script>

<div
  class="grid grid-cols-[auto_1fr_auto] w-11/12 m-auto gap-4 items-center mt-10"
>
  <!-- Button: Left -->
  <button
    type="button"
    class="w-12 h-full variant-ghost text-center rounded opacity-50"
    on:click={multiColumnLeft}
  >
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
        stroke-opacity="0.5"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  </button>
  <!-- Carousel -->
  <div
    bind:this={elemMovies}
    class="snap-x snap-mandatory scroll-smooth flex gap-2 pb-2 overflow-x-auto"
  >
    {#if $session.id != undefined && events != undefined}
      {#if $session.id.length > 0 && participants != undefined}
        {#each events as event, i}
          <CarouselCard
            eventInfo={event}
            guestInfo={getGuest(event)}
            value={getParticipant(event.id)}
            counter={i}
          />
        {/each}
      {/if}
    {/if}
  </div>
  <!-- Button-Right -->
  <button
    type="button"
    class="w-12 h-full variant-ghost text-center rounded opacity-50"
    on:click={multiColumnRight}
  >
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
        stroke-opacity="0.5"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  </button>
</div>
