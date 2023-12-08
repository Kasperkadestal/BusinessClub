<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabaseClient";
  import { session } from "$lib/layout/user";

  let username = "";
  let password = "";

  const loginUser = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username, // or however you handle usernames
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      return;
    }
    checkPrivilege(data.user.id);
  };

  async function checkPrivilege(id: string) {
    const { data, error } = await supabase.from("profile").select("*").eq("id",id);
    const user = data[0];
    session.set(user);

    console.log(user);
    
    if (user.role == "admin") {
      session
      goto("/admin");
    } else {
      goto("/user");
    }
  }
</script>

<div class="w-screen h-screen flex items-center align-center">
  <div class="w-2/4 card p-8 m-auto text-center">
    <b
      on:click={() => goto("/")}
      class="text-xl uppercase cursor-pointer text-primary-500"
    >
      Bizz Club
    </b>

    <input
      bind:value={username}
      class="input !rounded-md mt-8"
      title="Input (text)"
      type="text"
      placeholder="username"
    />

    <input
      bind:value={password}
      class="input !rounded-md my-4"
      title="Input (password)"
      type="password"
      placeholder="password"
    />

    <button
      on:click={loginUser}
      class="btn btn-md rounded-md variant-ghost-primary w-full mt-4"
    >
      Logga in
    </button>
  </div>
</div>
