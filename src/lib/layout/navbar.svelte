<script lang="ts">
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

  let tabSet: number = 0;
</script>

<AppBar class="!bg-primary-800">
  <svelte:fragment slot="lead">
    <strong class="text-xl uppercase">Bizz Club</strong>
  </svelte:fragment>
  <svelte:fragment slot="trail">
    <a class="btn btn-sm variant-ghost-surface" use:popup={popupClick}>
      <Avatar
        class="mr-2 -ml-1"
        src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
        width="w-8"
        rounded="rounded-full"
      />
      Peter Petersson
    </a>

    <div class="card p-8 w-96 !z-50 !left-[calc(100%-430px)]" data-popup="popupClick">
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
        <!-- Tab Panels --->
        <svelte:fragment slot="panel">
          {#if tabSet === 0}
            <div>
              <div>Antal gäster kvar: 5</div>
              <button class="btn variant-filled-primary mt-8">Logga ut</button>
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
                <input class="input !rounded" type="text" placeholder="Jenka.com" />
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
          {/if}
        </svelte:fragment>
      </TabGroup>
      <div class="arrow variant-filled-surface !bg-surface-800" />
    </div>
  </svelte:fragment>
</AppBar>
