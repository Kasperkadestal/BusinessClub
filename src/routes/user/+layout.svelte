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
  import Navbar from "$lib/layout/user/navbar.svelte";
  import Sidebar from "$lib/layout/user/sidebar.svelte";
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { conversations, session, users } from "$lib/layout/user";
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  async function fetchConversations() {
    const { data: conversationsData, error: conversationsError } =
      await supabase
        .from("conversation")
        .select("*")
        .or(`user1_id.eq.${$session.id}, user2_id.eq.${$session.id}`);

    if (conversationsError) {
      console.error(
        "Error fetching conversations:",
        conversationsError.message
      );
    } else {
      $conversations = conversationsData;
    }
  }

  async function fetchUsers() {
    const { data, error } = await supabase.from("profile").select("*");

    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      $users = data.filter((contact) => contact.id !== $session.id);
    }
  }


  onMount(async () => {
    let id;

    if (true) {
      let { data } = await supabase.auth.getUser();
      id = data.user.id;
    }

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", id);

    const user = data[0];
    session.set(user);
    console.log($session);

    await fetchConversations()
    await fetchUsers();
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
