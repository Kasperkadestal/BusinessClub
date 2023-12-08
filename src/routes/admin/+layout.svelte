<script lang="ts">
    import "../../app.postcss";
    import { AppShell } from "@skeletonlabs/skeleton";
  
    // Floating UI for Popups
    import {
      computePosition,
      autoUpdate,
      flip,
      shift,
      offset,
      arrow,
    } from "@floating-ui/dom";
    import { storePopup } from "@skeletonlabs/skeleton";
    import Navbar from "$lib/layout/admin/navbar.svelte";
    import Sidebar from "$lib/layout/admin/sidebar.svelte";
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { session } from "$lib/layout/user";
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

    onMount(async()=> {
      if ($session == null) {
        let id;
        if (true) {
          let { data } = await supabase.auth.getUser();
          id = data.user.id
        }
        const { data, error } = await supabase.from("profile").select("*").eq("id",id);
        const user = data[0];
        
        session.set(user);
      } 
    });

  </script>
  
  <!-- App Shell -->
  <AppShell>
    <svelte:fragment slot="header">
      <Navbar />
    </svelte:fragment>
    <svelte:fragment slot="sidebarLeft">
      <Sidebar />
    </svelte:fragment>
    <slot />
  </AppShell>
  