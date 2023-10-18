<script lang="ts">
  import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";

  let currentTile: number = 0;
</script>

<AppRail class="!bg-surface-900 border-r-2 border-surface-800">
  <AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
    <svelte:fragment slot="lead">(icon)</svelte:fragment>
    <span>Tile 1</span>
  </AppRailTile>
  <AppRailTile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
    <svelte:fragment slot="lead">(icon)</svelte:fragment>
    <span>Tile 2</span>
  </AppRailTile>
  <AppRailTile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
    <svelte:fragment slot="lead">(icon)</svelte:fragment>
    <span>Tile 3</span>
  </AppRailTile>
</AppRail>
