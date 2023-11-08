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
  
    let tabSet = 0;
  </script>
  
  <AppBar class="!bg-primary-800">
    <svelte:fragment slot="lead">
      <strong class="text-xl uppercase">Bizz Club</strong>
    </svelte:fragment>
  </AppBar>
  