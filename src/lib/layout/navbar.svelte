<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    AppBar,
    Avatar,
    popup,
    TabGroup,
    type PopupSettings,
    Tab,
  } from "@skeletonlabs/skeleton";

  const popupClick: PopupSettings = {
    event: "click",
    target: "popupClick",
    placement: "bottom",
  };

  let tabSet = 0;
</script>

<AppBar class="!bg-primary-800">
  <svelte:fragment slot="lead">
    <strong on:click={() => goto("/")} class="text-xl uppercase cursor-pointer"
      >Bizz Club</strong
    >
  </svelte:fragment>
  <svelte:fragment slot="trail">
    <a
      class="btn btn-sm variant-ghost-surface cursor-pointer"
      use:popup={popupClick}
    >
      <Avatar
        class="mr-2 -ml-1"
        src="https://ihs-us.org/wp-content/uploads/2017/03/placeholder2.jpg"
        width="w-8"
        rounded="rounded-full"
      />
      Peter Petersson
    </a>

    <div
      class="card p-8 w-96 !z-50 !left-[calc(100%-430px)]"
      data-popup="popupClick"
    >
      <TabGroup>
        <Tab bind:group={tabSet} name="tab1" value={0}>
          <svelte:fragment slot="lead">
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
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </div>
          </svelte:fragment>
        </Tab>
        <Tab bind:group={tabSet} name="tab2" value={1}>
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
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </Tab>
        <Tab bind:group={tabSet} name="tab3" value={2}>
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
                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
              />
            </svg>
          </div>
        </Tab>
        <!-- Tab Panels --->
        <svelte:fragment slot="panel">
          {#if tabSet === 0}
            <div>
              <div>
                <small class="mb-2 opacity-50"
                  >Prenumeration giltig: 2024-01-01</small
                >
              </div>
              <div class="mt-6">Antal gäster kvar: 5</div>
              <div class="py-2">Antal kontakter kvar: 3</div>
              <button class="btn variant-filled-primary mt-6">Logga ut</button>
            </div>
          {:else if tabSet === 1}
            <div class="flex flex-col gap-4">
              <label class="label text-sm">
                <span>Namn</span>
                <input
                  class="input !rounded"
                  type="text"
                  placeholder="Peter Petersson"
                />
              </label>
              <label class="label text-sm">
                <span>Email</span>
                <input
                  class="input !rounded"
                  type="text"
                  placeholder="Peter.petersson@jenka.com"
                />
              </label>
              <label class="label text-sm">
                <span>Företag</span>
                <input class="input !rounded" type="text" placeholder="Jenka" />
              </label>
              <label class="label text-sm">
                <span>Hemsida</span>
                <input
                  class="input !rounded"
                  type="text"
                  placeholder="Jenka.com"
                />
              </label>
              <label class="label text-sm">
                <span>Tjänst</span>
                <select class="select">
                  <option value="1">Finans</option>
                  <option value="2">Design</option>
                  <option value="3">Ingenjör</option>
                  <option value="4">Välgörenhet</option>
                  <option value="5">Bygg</option>
                </select>
              </label>
              <label class="label text-sm">
                <span>Om Jenka</span>
                <textarea
                  class="textarea"
                  rows="4"
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                />
              </label>
            </div>
          {:else}
            <div class="h-[50vh] overflow-y-scroll overflow-x-hidden">
              <b>Business Club Medlemskapsavtal</b>
              <p>
                Detta avtal (härefter &quot;Avtal&quot;) ingås mellan
                Trelleborgs Business Club (härefter &quot;Klubben&quot;) och
                __________________________________________________________
                (härefter &quot;Medlemmen&quot;) med avseende på medlemskap i
                Business Club Trelleborg (härefter &quot;Business Club&quot;).
                <br><br>
                1. Medlemskapets Varaktighet Medlemskapet i Business Club gäller
                från det datum då detta avtal undertecknas och fortsätter från
                termin till termin. Varje termin omfattar en period enligt
                följande: • Vårtermin: Januari till maj • Hösttermin: Augusti
                till november 2. Medlemsförmåner Medlemskapet i Business Club
                inkluderar följande förmåner: • Cirka 15 träffar per termin, som
                äger rum varje tisdag i månaden kl. 11.55-13.00. •
                Nätverksmöjligheter vid träffarna. • Lunch, vatten, kaffe/te och
                kaka vid träffarna. • Möjlighet att ta med 2 gäster per termin
                kostnadsfritt. Därefter debiteras en engångsavgift (betalas på
                plats eller via faktura). • Medlemskapet meddelar priset per
                månad för den kommande terminen senast 6 veckor före innehavande
                termins slut. Fakturering sker i förväg. 3. Medlemmens Samtycke
                Medlemmen samtycker till att dess kontaktuppgifter delas inom
                Business Club Trelleborg med andra medlemmar som vill komma i
                kontakt med Medlemmen. Samtycke ges även för att inkluderas i
                Business Club Trelleborgs LinkedIn-grupp &quot;Business Club
                Trelleborg.&quot; 4. Avslut av Medlemskap Medlemskapet i
                Business Club förnyas automatiskt för en ny termin om det inte
                sägs upp skriftligen av Medlemmen senast 1 månad innan
                innehavande termin upphör. 5. Ansvar och Förpliktelser Både
                Klubben och Medlemmen förbinder sig att uppfylla sina respektive
                åtaganden enligt detta Avtal. 6. Ändringar i Avtalet Eventuella
                ändringar eller tillägg till detta Avtal ska vara skriftliga och
                undertecknas av båda parter. 7. Jurisdiktion Detta Avtal
                regleras av och tolkas i enlighet med svensk lag. Undertecknat:
                [Företagsnamn] [Adress] [Stad, Postnummer] Kontaktperson: [Ditt
                Namn] Datum: [Datum] [Medlemsnamn] [Adress] [Stad, Postnummer]
                Datum: [Datum] Genom att underteckna detta Avtal bekräftar både
                Klubben och Medlemmen att de har läst, förstått och accepterat
                villkoren i detta medlemskapsavtal för Business Club Trelleborg.
              </p>
            </div>
          {/if}
        </svelte:fragment>
      </TabGroup>
      <div class="arrow variant-filled-surface !bg-surface-800" />
    </div>
  </svelte:fragment>
</AppBar>
