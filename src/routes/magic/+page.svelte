<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { supabase } from "$lib/supabaseClient";
  import { session } from "$lib/layout/user";

  

  let email = "";
  let password = "";

  async function signInWithEmail() {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: false,
      emailRedirectTo: 'https://example.com/welcome',
    },
  })
}

  const loginUser = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email, // or however you handle usernames
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
      bind:value={email}
      class="input !rounded-md mt-8"
      title="Input (text)"
      type="text"
      placeholder="email"
    />

    <button
      on:click={signInWithEmail}
      class="btn btn-md rounded-md variant-ghost-primary w-full mt-4"
    >
      Logga in
    </button>
  </div>
</div>
