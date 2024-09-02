<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { session } from "$lib/layout/user";

  onMount(async () => {
    console.log("LOGGING IN WITH TOKEN");

    const token = await $page.url.searchParams.get("token_hash");

    console.log(token);

    if (token) {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      });
      console.log(data);
      checkPrivilege(data.user?.id);
    }
  });

  async function checkPrivilege(id) {
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

<p>HELLO</p>
