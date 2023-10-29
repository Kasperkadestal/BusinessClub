<script lang="ts">
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

  let value: number = 2;
  export let counter: number;
</script>

<div class="shrink-0 w-[28%] h-82 card snap-start text-center">
  <div class="flex px-6 bg-primary-800 items-center">
    <div class="h-12 w-full flex items-center justify-center">
      <p class="text-left">
        <b>Vecka {counter + 1} </b>
      </p>
    </div>
  </div>
  <RadioGroup rounded="none" display="flex">
    <RadioItem
      active="variant-filled-success"
      hover="hover:variant-soft-success"
      bind:group={value}
      name="justify"
      value={0}
    >
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
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </RadioItem>
    <RadioItem
      active="variant-filled-warning"
      hover="hover:variant-soft-warning"
      bind:group={value}
      name="justify"
      value={1}
    >
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
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
      </div>
    </RadioItem>
    <RadioItem
      active="variant-filled-surface"
      hover="hover:variant-soft-surface"
      bind:group={value}
      name="justify"
      value={2}
    >
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
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </RadioItem>
  </RadioGroup>
  <div class="py-6">
    <div class="text-left ml-4">
      <a
        class="btn btn-sm variant-ghost-surface opacity-50 mb-4"
        href="https://github.com/skeletonlabs/skeleton"
        target="_blank"
        rel="noreferrer"
      >
      Lägg till gäst...
      </a>
    </div>



    <p class="opacity-50">
      Dr. John Brown is hosting a virtual webinar series dedicated to educating
      his audience.
    </p>
  </div>
  <div
    class="border-t border-surface-900 flex items-center justify-between px-6 h-16"
  >
    <p class="text-primary-500 flex items-center h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 mr-1 inline-block"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      2023-0{((counter + 1) % 9) + 1}-1{(counter + 1) % 9} 12:00
    </p>
    <p class="text-primary-500 flex items-center h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 inline-block mr-1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
      13
    </p>
  </div>
</div>
