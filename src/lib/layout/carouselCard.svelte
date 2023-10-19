<script lang="ts">
  import { SlideToggle } from "@skeletonlabs/skeleton";

  export let counter: number;
</script>

<div class="shrink-0 w-[28%] h-82 card snap-start text-center">
  <div class="flex bg-primary-800 items-center justify-between px-6 h-12">
    <p class="h-12 flex items-center justify-left">
      <b>Vecka {counter + 1}</b>
    </p>
    <SlideToggle name="slider-small" active="bg-primary-500" size="sm" />
  </div>
  <div class="p-6 pt-4 text-justify h-40 opacity-50">
    Datum: 2023-0{(counter + 1)%9+1}-1{(counter + 1)%9}
    <br> <br>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin fermentum,
    ligula egestas interdum fringilla.
  </div>
  <div
    class="border-t border-surface-900 flex items-center justify-between px-6 h-16"
  >
    <a
      class="btn btn-sm variant-ghost-surface opacity-50"
      href="https://github.com/skeletonlabs/skeleton"
      target="_blank"
      rel="noreferrer"
    >
      Lägg till gäst...
    </a>
  </div>
</div>


