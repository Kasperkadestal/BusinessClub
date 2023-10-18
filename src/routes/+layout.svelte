<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
  import Navbar from '$lib/layout/navbar.svelte';
  import SideBar from '$lib/layout/sideBar.svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<Navbar />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SideBar />
	</svelte:fragment>
	<slot />
</AppShell>
