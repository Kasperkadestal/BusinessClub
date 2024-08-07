<!-- Raffle.svelte -->
<script lang="ts">
  import Table from "$lib/layout/admin/raffle/table.svelte";
  import { onMount } from "svelte";
  import { raffleStore } from "$lib/layout/admin/raffle/raffle";
  import { supabase } from "$lib/supabaseClient";
  import { users } from "../.././user";

  import {
    Accordion,
    AccordionItem,
    ListBox,
    ListBoxItem,
    getModalStore,
    type ModalSettings,
    Modal,
    SlideToggle,
  } from "@skeletonlabs/skeleton";

  type Participant = {
    name: string;
    company: string;
    key?: string;
    isActive: boolean;
    selectedTableId?: number; // New property to hold the table ID for each member
    guest?: any;
  };

  type Seating = {
    table: string;
    participant: string;
  };

  let seatMap = new Map();

  let seatings: Seating[][] = []; // Assuming seatings is defined globally

  let numTables = 2; // Initial number of tables
  let seatsPerTable = 3; // Initial seats per table
  let selectedTableId; // Declare a variable to hold the selected table's ID

  $: tableComponents = $raffleStore;
  $: availableTables = getAvailableTables($raffleStore);

  function getAvailableTables(raffleStore) {
    return raffleStore.map((table) => ({
      ...table,
      isAvailable: table.participants.length < table.seats,
    }));
  }

  let events = [];

  onMount(async () => {
    await fetchEvents();
    fetchLatestSeating();
    updateTables();
  });

  function getWeekNumber(d: Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(
      ((d.valueOf() - yearStart.valueOf()) / 86400000 + 1) / 7
    );
    return weekNo;
  }

  async function fetchEvents() {
    const { data, error } = await supabase
      .from("event")
      .select("id, title, date");
    if (error) {
      console.error("Error fetching events:", error);
    } else {
      events = data.map((event) => {
        const eventDate = new Date(event.date);
        const year = eventDate.getFullYear();
        const week = getWeekNumber(eventDate);
        return {
          ...event,
          date: `${year} | Vecka ${week}`,
        };
      });
    }
  }

  async function fetchLatestSeating() {
    const { data, error } = await supabase
      .from("seating")
      .select("participants")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching latest seating:", error);
    } else {
      // Assuming the data structure is an array of seating objects with a 'participants' array
      seatings = data.map((seating) =>
        seating.participants.map((participant: any) => participant)
      );
    }
  }

  function removeGuest(guestToRemove) {
    // Find the guest in the guests array by matching the key
    const guestIndex = guests.findIndex(
      (guest) => guest.key === guestToRemove.key
    );

    if (guestIndex !== -1) {
      // Remove the guest from the array
      guests.splice(guestIndex, 1);

      // Update the guests array to trigger reactivity in Svelte
      guests = [...guests];
      removeParticipant(guestToRemove);
    } else {
      console.warn("Guest not found in the guests array");
    }
  }

  function checkInParticipant(participant: Participant) {
    const seat = generateSeatPlacement(participant);
    $raffleStore[seat.tableId].participants.push(participant);
    raffleStore.set($raffleStore); // Update the store to trigger reactivity
    availableTables = getAvailableTables($raffleStore);
    return seat;
  }

  function mapSeating(name: string) {
    const names: string[] = [];
    seatings.forEach((week) => {
      if (week.some((obj) => obj.participant === name)) {
        const id = week.find((obj) => obj.participant === name)?.table;
        week.forEach((seat) => {
          if (seat.table == id) {
            names.push(seat.participant);
          }
        });
      }
    });
    seatMap.set(name, names);
  }

  function generateSeatPlacement(participant: Participant) {
    mapSeating(participant.name);

    let minTableId = 0;
    let minNumIncludedNames = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < $raffleStore.length; i++) {
      if ($raffleStore[i].seats > $raffleStore[i].participants.length) {
        minTableId = i;
        break;
      }
    }

    // Iterate through tables to find the one with the lowest number of included names
    $raffleStore.forEach((table, index) => {
      if (table.seats < table.participants.length) {
        const includedNames: string[] = seatMap.get(participant.name) || [];
        let num = 0;

        table.participants.forEach((p) => {
          if (includedNames.includes(p.name)) {
            num++;
          }
        });

        if (num < minNumIncludedNames) {
          minNumIncludedNames = num;
          minTableId = index;
        }
      }
    });
    return {
      tableId: minTableId,
      seatNumber: $raffleStore[minTableId].participants.length,
    };
  }

  let checkInText = "Tryck på en medlem för att tildela en bordplacering.";

  async function handleCheckIn(participantCheckIn: Participant) {
    const existingParticipant = $raffleStore.find((table) =>
      table.participants.some((p) => p.name === participantCheckIn.name)
    );

    if (existingParticipant) {
      console.log(
        `You are already seated at Table ${existingParticipant.id + 1}`
      );

      // Optionally, you can display the existing seat to the user in the UI
    } else {
      // Your existing logic for checking in a participant
      const participant: Participant = {
        name: participantCheckIn.name,
        key: participantCheckIn.key,
        company: participantCheckIn.company,
      };
      const seatPlacement = checkInParticipant(participant);
      checkInText = `${participantCheckIn.name}: Bord ${
        seatPlacement.tableId + 1
      }`;

      const memberIndex = members.findIndex((m) => m.key === participant.key);

      if (memberIndex !== -1) {
        members[memberIndex] = {
          ...members[memberIndex],
          selectedTableId: seatPlacement.tableId + 1,
          isActive: true,
        };
        members = [...members]; // create a new reference to trigger update in Svelte
      } else {
        const guestIndex = guests.findIndex((g) => g.key === participant.key);

        if (guestIndex !== -1) {
          guests[guestIndex] = {
            ...guests[guestIndex],
            selectedTableId: seatPlacement.tableId + 1,
            isActive: true,
          };
          guests = [...guests]; // Trigger reactivity in Svelte
        } else {
          console.warn("Participant not found in members or guests arrays");
        }
      }

      console.log(
        `You are seated at Table ${seatPlacement.tableId}, Seat ${seatPlacement.seatNumber}`
      );
      // Optionally, you can display the assigned seat to the user in the UI
    }
  }

  function updateTables() {
    $raffleStore = Array.from({ length: numTables }, (_, index) => ({
      id: index + 1,
      seats: seatsPerTable,
      participants: [],
    }));
    raffleStore.set($raffleStore); // Update the store to trigger reactivity
  }

  async function exportToJson() {
    const jsonData = {
      participants: $raffleStore.flatMap((table) =>
        table.participants.map((participant) => ({
          table: `${table.id}`,
          participant: participant,
        }))
      ),
    };

    console.log(jsonData);

    const { error } = await supabase.from("seating").upsert([jsonData]);

    if (error) {
      console.error("Error exporting to JSON:", error);
    }
  }

  function generateMembers() {
    // Assuming the structure of the 'users' array
    return $users.map((user) => ({
      name: `${user.first_name} ${user.last_name}`,
      key: user.id,
      company: user.company,
      isActive: false, // Add isActive property
      selectedTableId: null, // Initialize with null or any default value
    }));
  }

  let members: Participant[] = generateMembers();
  sortMembersAlphabetically();

  function sortMembersAlphabetically() {
    members = [...members].sort((a, b) => a.name.localeCompare(b.name));
  }

  let selectedMembers: Participant[] = [];

  // Watch for changes in selectedUsers and trigger handleCheckIn when a new user is selected
  let prevSelectedMembers: Participant[] = [];

  const modalStore = getModalStore();

  $: {
    const addedMembers = selectedMembers.filter(
      (member) => !prevSelectedMembers.includes(member)
    );

    const removedMembers = prevSelectedMembers.filter((prevMember) =>
      addedMembers.some((addedMember) => addedMember.key === prevMember.key)
    );

    if (addedMembers.length > 0) {
      // Handle added members if needed
      addedMembers.forEach((newUser) => handleCheckIn(newUser));
    }
    console.log("Added");
    console.log(addedMembers);
    console.log("Prev");
    console.log(prevSelectedMembers);
    console.log("Removed");
    console.log(removedMembers);

    if (removedMembers.length > 0) {
      const name = removedMembers[0].name;

      new Promise<boolean>((resolve) => {
        const modal: ModalSettings = {
          type: "confirm",
          title: "Bekräfta borttagning",
          body: "Är du säker på att du vill ta bort " + name + "?",
          buttonTextCancel: "Nej",
          buttonTextConfirm: "Ja",
          response: (r: boolean) => {
            resolve(r);
          },
        };
        modalStore.trigger(modal);
      }).then((r: boolean) => {
        if (r) {
          removedMembers.forEach((r) => {
            removeParticipant(r);
            members = members.map((member) => {
              if (member.key === r.key) {
                return { ...member, isActive: false };
              }
              return member;
            });
          });
          console.log("YES");
          prevSelectedMembers = prevSelectedMembers.filter(
        (prevMember) => !removedMembers.some((removedMember) => removedMember.key === prevMember.key)
      );
        } else {
          console.log("NO");
          removedMembers.forEach((r) => {
            selectedMembers.push(r);
            selectedMembers = [...selectedMembers];
            console.log(selectedMembers);
          });
        }
        modalStore.clear(); // Reset modal state
      });
    }
    selectedMembers = selectedMembers.filter(
        (prevMember) => !removedMembers.some((removedMember) => removedMember.key === prevMember.key)
      );
    prevSelectedMembers = [...selectedMembers];
    console.log("SELECTED");
    console.log(selectedMembers);
    
  }

  function removeParticipant(participant: Participant) {
    $raffleStore.forEach((table) => {
      const index = table.participants.findIndex(
        (p) => p.name === participant.name
      );
      if (index !== -1) {
        table.participants.splice(index, 1);
        raffleStore.set($raffleStore); // Update the store to trigger reactivity
        checkInText = `${participant.name} lämnar bord ${table.id}`;
      } else {
        console.log("Not found in index");
        console.log($raffleStore);
        console.log(participant.name);
      }
    });
  }

  function addTable() {
    console.log("ADD");

    $raffleStore.push({
      id: $raffleStore.length + 1,
      seats: seatsPerTable,
      participants: [],
    });

    raffleStore.set($raffleStore);
  }

  function removeTable() {
    console.log("REMOVE");

    $raffleStore.pop();
    raffleStore.set($raffleStore);
  }

  let selectedEventId = "";

  async function handleEventChange() {
    if (selectedEventId === "") {
      members = generateMembers();
    } else {
      // An event is selected
      await fetchParticipantsForEvent(selectedEventId);
    }
  }

  async function fetchParticipantsForEvent(eventId) {
    const { data, error } = await supabase
      .from("participant")
      .select("pid, eid, status, profile (id, first_name, last_name, company)")
      .eq("eid", eventId);

    if (error) {
      console.error("Error fetching participants:", error);
      return;
    }

    let eventParticipants = data.map((participant) => ({
      name: `${participant.profile.first_name} ${participant.profile.last_name}`,
      company: participant.profile.company,
      key: participant.profile.id,
      status: participant.status,
      isActive: false, // Indicates participation in an event
    }));

    // Merge with all members and assign default status 0 if not found in event participants
    members = $users.map((user) => {
      const participant = eventParticipants.find((p) => p.key === user.id);
      return (
        participant || {
          name: `${user.first_name} ${user.last_name}`,
          company: user.company,
          key: user.id,
          status: 0, // Default status
          isActive: false,
        }
      );
    });

    // Sort by status descending, then by name alphabetically
    members.sort((a, b) => {
      if (b.status - a.status !== 0) {
        return b.status - a.status;
      }
      return a.name.localeCompare(b.name);
    });

    members = [...members]; // Update array reference to trigger reactivity in Svelte
    console.log(
      "Sorted members:",
      members.map((m) => `${m.name}: ${m.status}`)
    );
  }

  $: sortedMembers = [...members];

  function assignManually(member: any, tableInput: any) {
    const existingTableIndex = $raffleStore.findIndex((table) =>
      table.participants.some((p) => p.name === member.name)
    );

    // If the participant is found at an existing table, remove them from that table
    if (existingTableIndex !== -1) {
      $raffleStore[existingTableIndex].participants = $raffleStore[
        existingTableIndex
      ].participants.filter((p) => p.name !== member.name);
    }

    let table = availableTables.filter((table) => table.id == tableInput);

    table = table[0];

    const participant: Participant = {
      name: member.name,
      key: member.key,
      company: member.company,
      isActive: true,
    };

    $raffleStore[table.id - 1].participants.push(participant);
    raffleStore.set($raffleStore); // Update the store to trigger reactivity

    checkInText = `${member.name}: Bord ${table.id}`;
    console.log(
      `You are seated at Table ${table.id}, Seat ${table.participants.length - 1}`
    );
    // Find the index of the member you want to update
    const memberIndex = members.findIndex((m) => m.key === member.key);

    if (memberIndex !== -1) {
      // Create a new member object with updated properties
      const updatedMember = { ...members[memberIndex], isActive: true };

      // Create a new array with the updated member
      members = [
        ...members.slice(0, memberIndex),
        updatedMember,
        ...members.slice(memberIndex + 1),
      ];
    }

    selectedMembers = [...selectedMembers, participant];
    console.log(selectedMembers);
  }

  let guestName = "";

  const modal: ModalSettings = {
    type: "prompt",
    // Data
    title: "Name på gäst",
    body: "Provide your first name in the field below.",
    // Populates the input value and attributes
    value: "Namn",
    valueAttr: { type: "text", minlength: 3, maxlength: 10, required: true },
    // Returns the updated response value
    response: (r: string) => (guestName = r),
  };

  let guests = [];

  function addGuest(member) {
    new Promise<boolean>((resolve) => {
      const modal: ModalSettings = {
        type: "prompt",
        // Data
        title: "Lägg till gäst",
        body: "Skriv gästens fulla namn:",
        // Populates the input value and attributes
        value: "",
        valueAttr: {
          type: "text",
          minlength: 3,
          maxlength: 20,
          required: true,
        },
        response: (r: boolean | string) => {
          resolve(r);
        },
      };
      modalStore.trigger(modal);
    }).then((r: boolean | string) => {
      if (typeof r === "string" && r.trim().length > 0) {
        const guest = {
          name: r,
          company: member.company,
          key: `${member.key}-guest`,
          isActive: false,
          selectedTableId: null,
        };

        // Assuming each member has a property 'guests' which is an array
        if (!member.guests) {
          member.guests = [];
        }

        member.guests.push(guest);
        members = [...members]; // Trigger reactivity in Svelte
        guests.push(guest);
        guests = guests;
      }
    });
  }
</script>

<Modal />

<Accordion autocollapse>
  <AccordionItem open>
    <svelte:fragment slot="lead"
      ><svg
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
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    </svelte:fragment>
    <svelte:fragment slot="summary">Avprickning</svelte:fragment>
    <svelte:fragment slot="content">
      <div class="flex gap-4">
        <div class="card p-8 items-center w-4/5">
          <p class="text-lg text-center w-full">
            <b>{checkInText}</b>
          </p>
        </div>
        <label class="p-8 w-1/5 card">
          <select
            class="select"
            bind:value={selectedEventId}
            on:change={handleEventChange}
          >
            <option value="">Välj event</option>
            {#each events as event}
              <option value={event.id}>{event.date}</option>
            {/each}
          </select>
        </label>
      </div>
      <div class="overflow-scroll overflow-x-hidden h-[50vh] card p-8">
        <ListBox multiple>
          {#each sortedMembers as member, index}
            <ListBoxItem
              bind:group={selectedMembers}
              name="medium"
              active="variant-ghost-primary"
              padding="p-4"
              rounded="none"
              value={member}
              class="{index % 2 === 0
                ? ''
                : 'bg-tertiary-800/10'} {member.isActive
                ? 'variant-ghost-primary'
                : ''}"
            >
              <div class="flex items-center">
                <div class="w-4/5">
                  <svg
                    class="w-5 h-5 mr-2 {member.status === 2
                      ? 'text-success-800'
                      : member.status === 1
                        ? 'text-warning-800'
                        : 'text-error-800'}"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <p class="text-lg">
                    {member.name}
                  </p>
                </div>

                <div class="w-2/5 flex gap-2 items-center">
                  <button
                    class="btn variant-ghost-secondary rounded-sm"
                    on:click={() => addGuest(member)}
                  >
                    <svg
                      class="w-6 h-6 text-gray-800 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <select class="select" bind:value={member.selectedTableId}>
                    {#each availableTables as table}
                      <option
                        value={table.id}
                        disabled={!table.isAvailable &&
                          table.id !== member.selectedTableId}
                      >
                        Bord {table.id}
                        {table.isAvailable ? "" : "(Full)"}
                      </option>
                    {/each}
                  </select>
                  <button
                    class="btn variant-ghost-primary rounded-sm"
                    on:click={() =>
                      assignManually(member, member.selectedTableId)}
                  >
                    <!-- Check in manually button -->
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
                        d="M5 11.917 9.724 16.5 19 7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <small class="opacity-50">{member.company}</small>
            </ListBoxItem>
          {/each}

          <!-- Display guests if any -->
          {#if guests}
            {#each guests as guest, index}
              <ListBoxItem
                bind:group={selectedMembers}
                name="medium"
                active="variant-ghost-primary"
                padding="p-4"
                rounded="none"
                value={guest}
                class="{index % 2 === 0
                  ? ''
                  : 'bg-tertiary-800/10'} {guest.isActive
                  ? 'variant-ghost-primary'
                  : ''}"
              >
                <div class="flex items-center">
                  <div class="w-4/5">
                    <svg
                      class="w-5 h-5 mr-2 {guest.status === 2
                        ? 'text-success-800'
                        : guest.status === 1
                          ? 'text-warning-800'
                          : 'text-error-800'}"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                        clip-rule="evenodd"
                      />
                    </svg>

                    <p class="text-lg">
                      {guest.name}
                    </p>
                  </div>

                  <div class="w-2/5 flex gap-2 items-center">
                    <button
                      class="btn variant-ghost-error rounded-sm"
                      on:click={() => removeGuest(guest)}
                    >
                      <svg
                        class="w-6 h-6 text-gray-800 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm-2 9a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1Zm13-6a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-4Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <select class="select" bind:value={guest.selectedTableId}>
                      {#each availableTables as table}
                        <option
                          value={table.id}
                          disabled={!table.isAvailable &&
                            table.id !== guest.selectedTableId}
                        >
                          Bord {table.id}
                          {table.isAvailable ? "" : "(Full)"}
                        </option>
                      {/each}
                    </select>
                    <button
                      class="btn variant-ghost-primary rounded-sm"
                      on:click={() =>
                        assignManually(guest, guest.selectedTableId)}
                    >
                      <!-- Check in manually button -->
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
                          d="M5 11.917 9.724 16.5 19 7.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <small class="opacity-50">{guest.company}</small>
              </ListBoxItem>
            {/each}
          {/if}
        </ListBox>
      </div>
    </svelte:fragment>
  </AccordionItem>
  <AccordionItem>
    <svelte:fragment slot="lead"
      ><svg
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
          d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
        />
      </svg>
    </svelte:fragment>
    <svelte:fragment slot="summary">Bordsplanering</svelte:fragment>
    <svelte:fragment slot="content">
      <div class="card p-8">
        <div class="flex space-x-4 mb-4">
          <label for="numTables">Bord:</label>
          <input
            class="input"
            title="Input (number)"
            type="number"
            bind:value={numTables}
            id="numTables"
            min="1"
          />
          <label for="seatsPerTable">Platser:</label>
          <input
            class="input"
            title="Input (number)"
            type="number"
            bind:value={seatsPerTable}
            id="seatsPerTable"
            min="1"
          />
          <button
            class="btn btn-md variant-ghost-tertiary mt-4"
            on:click={updateTables}>Updatera</button
          >
          <button
            class="btn btn-md variant-ghost-tertiary mt-4"
            on:click={exportToJson}>Spara</button
          >
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mt-4">
        {#each tableComponents as table (table.id)}
          <Table {table} />
        {/each}
        <div class="flex items-center">
          <a on:click={addTable}>
            <button class="btn btn-md w-1/3 variant-ghost-surface">+</button>
          </a>
          <a on:click={removeTable}>
            <button class="btn btn-md w-1/3 variant-ghost-surface">-</button>
          </a>
        </div>
      </div>
    </svelte:fragment>
  </AccordionItem>
  <AccordionItem>
    <svelte:fragment slot="lead"
      ><svg
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
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    </svelte:fragment>
    <svelte:fragment slot="summary">Lista</svelte:fragment>
    <svelte:fragment slot="content"
      ><ul class="card p-8">
        {#each $raffleStore as table}
          <li class="my-4">
            <b>Bord {table.id}</b>
            {#each table.participants as participant}
              <br />
              {participant.name}
            {/each}
          </li>
        {/each}
      </ul></svelte:fragment
    >
  </AccordionItem>
</Accordion>
