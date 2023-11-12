<script lang="ts">
  import CarouselCard from "./carouselCard.svelte";

    
let elemMovies: HTMLDivElement;

function multiColumnLeft(): void {
	let x = elemMovies.scrollWidth;
	if (elemMovies.scrollLeft !== 0) x = elemMovies.scrollLeft - elemMovies.clientWidth;
	elemMovies.scroll(x, 0);
}

function multiColumnRight(): void {
	let x = 0;
	// -1 is used because different browsers use different methods to round scrollWidth pixels.
	if (elemMovies.scrollLeft < elemMovies.scrollWidth - elemMovies.clientWidth - 1) x = elemMovies.scrollLeft + elemMovies.clientWidth;
	elemMovies.scroll(x, 0);
}
					
</script>

<div class="grid grid-cols-[auto_1fr_auto] w-11/12 m-auto gap-4 items-center mt-10">
  <!-- Button: Left -->
  <button
    type="button"
    class="w-12 h-full variant-ghost text-center rounded opacity-50"
    on:click={multiColumnLeft}
  >
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.5" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
  </button>
  <!-- Carousel -->
  <div
    bind:this={elemMovies}
    class="snap-x snap-mandatory scroll-smooth flex gap-2 pb-2 overflow-x-auto"
  >
    {#each Array.from({ length: 20 }) as _, i}
      <CarouselCard counter={i} />
    {/each}
  </div>
  <!-- Button-Right -->
  <button
    type="button"
    class="w-12 h-full variant-ghost text-center rounded opacity-50"
    on:click={multiColumnRight}
  >
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.5" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
  
  </button>
</div>