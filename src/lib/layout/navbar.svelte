<script>
  import { AppBar, Avatar} from "@skeletonlabs/skeleton";
</script>

<AppBar class="!bg-primary-800">
  <svelte:fragment slot="lead">
    <strong class="text-xl uppercase">Business Club</strong>
  </svelte:fragment>
  <svelte:fragment slot="trail">
    <a
      class="btn btn-sm variant-ghost-surface"
      href="https://github.com/skeletonlabs/skeleton"
      target="_blank"
      rel="noreferrer"
    >
      <Avatar
        class="mr-2 -ml-1"
        src="https://images.unsplash.com/photo-1617296538902-887900d9b592?ixid=M3w0Njc5ODF8MHwxfGFsbHx8fHx8fHx8fDE2ODc5NzExMDB8&ixlib=rb-4.0.3&w=128&h=128&auto=format&fit=crop"
        width="w-8"
        rounded="rounded-full"
      />
      Peter Petersson
    </a>
  </svelte:fragment>
</AppBar>
