<script lang="ts">
  import "../app.postcss";

  // Floating UI for Popups
  import {
    computePosition,
    autoUpdate,
    flip,
    shift,
    offset,
    arrow,
  } from "@floating-ui/dom";

  import { storePopup,initializeStores } from "@skeletonlabs/skeleton";
  initializeStores();

  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

</script>

<slot />