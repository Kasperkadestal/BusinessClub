<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    AppBar,
    popup,
    type PopupSettings,
  } from "@skeletonlabs/skeleton";

  import { name,logout } from "$lib/layout/user";

  const popupClick: PopupSettings = {
    event: "click",
    target: "popupClick",
    placement: "bottom",
  };

</script>

<AppBar class="!bg-primary-800">
  <svelte:fragment slot="lead">
    <strong on:click={() => goto("/")} class="text-xl uppercase cursor-pointer"
      >Bizz Club</strong
    >
  </svelte:fragment>
  <svelte:fragment slot="trail">
    <a
      class="btn btn-sm variant-ghost-surface cursor-pointer p-3 px-8"
      use:popup={popupClick}
    >
    {$name}
    </a>

    <div
      class="card p-8 w-96 !z-50 !left-[calc(100%-430px)]"
      data-popup="popupClick"
    >
    <button class="btn btn-md variant-ghost-primary" on:click={logout}>Logga ut</button>
      <div class="arrow variant-filled-surface !bg-surface-800" />
    </div>
  </svelte:fragment>
</AppBar>
