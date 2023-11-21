<!-- Raffle.svelte -->
<script lang="ts">
  import Table from "$lib/layout/admin/raffle/table.svelte";
  import { onMount } from "svelte";
  import { raffleStore } from "$lib/layout/admin/raffle/raffle";
  import { supabase } from "$lib/supabaseClient";
  import {
    Accordion,
    AccordionItem,
    ListBox,
    ListBoxItem,
    getModalStore,
    type ModalSettings,
    Modal,
  } from "@skeletonlabs/skeleton";
  import { faker } from "@faker-js/faker/locale/af_ZA";

  type Participant = {
    name: string;
    key?: string;
    // Add more participant details as needed
  };

  type Seating = {
    table: string;
    participant: string;
  };

  let seatMap = new Map();

  let seatings: Seating[][] = []; // Assuming seatings is defined globally

  let numTables = 2; // Initial number of tables
  let seatsPerTable = 6; // Initial seats per table

  $: tableComponents = $raffleStore;

  onMount(() => {
    fetchLatestSeating();
    updateTables();
  });

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

  function checkInParticipant(participant: Participant) {
    const seat = generateSeatPlacement(participant);
    $raffleStore[seat.tableId].participants.push(participant);
    raffleStore.set($raffleStore); // Update the store to trigger reactivity
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
      const key = participantCheckIn.name + Date.now();
      const participant: Participant = {
        name: participantCheckIn.name,
        key: key,
      };
      const seatPlacement = checkInParticipant(participant);
      checkInText = `${participantCheckIn.name}: Bord ${
        seatPlacement.tableId + 1
      }`;
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
          participant: participant.name,
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
    let generatedMembers: Participant[] = [];
    for (let index = 0; index < 20; index++) {
      generatedMembers.push({ name: faker.person.fullName() });
    }

    return generatedMembers;
  }

  let members: Participant[] = generateMembers();
  let selectedMembers: Participant[] = [];

  // Watch for changes in selectedUsers and trigger handleCheckIn when a new user is selected
  let prevSelectedMembers: Participant[] = [];

  const modalStore = getModalStore();

  $: {
    const addedMembers = selectedMembers.filter(
      (member) => !prevSelectedMembers.includes(member)
    );

    const removedMembers = prevSelectedMembers.filter(
      (member) => !selectedMembers.includes(member)
    );

 

    if (addedMembers.length > 0) {
      // Handle added members if needed
      addedMembers.forEach((newUser) => handleCheckIn(newUser));
    }

    if (removedMembers.length > 0) {

      const name = removedMembers[0].name;      

      new Promise<boolean>((resolve) => {
        const modal: ModalSettings = {
          type: "confirm",
          title: "Bekräfta borttagning",
          body: "Är du säker på att du vill ta bort " + {name}.name + "?",
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
          });
          console.log("YES");
        } else {
          console.log("NO");
          removedMembers.forEach((r) => {
            selectedMembers.push(r);
            selectedMembers = selectedMembers;
            console.log(selectedMembers);
            
          });
        }
        modalStore.clear(); // Reset modal state
      });
    }
    prevSelectedMembers = [...selectedMembers];
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
      }
    });
  }
</script>

<Modal />

<main class="w-11/12 h-screen m-auto pt-12">
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
        <div class="card p-8 items-center">
          <p class="text-lg text-center w-full">
            <b>{checkInText}</b>
          </p>
        </div>
        <div class="overflow-scroll overflow-x-hidden h-[55vh] card p-8">
          <ListBox multiple>
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
                  {member.name}
                </p>
              </ListBoxItem>
            {/each}
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
            <button on:click={updateTables}>Updatera</button>
          </div>
          <button
            class="btn btn-md variant-ghost-tertiary mt-4"
            on:click={exportToJson}>Export</button
          >
        </div>

        <div class="grid grid-cols-3 gap-4 mt-4">
          {#each tableComponents as table (table.id)}
            <Table {table} />
          {/each}
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
</main>
