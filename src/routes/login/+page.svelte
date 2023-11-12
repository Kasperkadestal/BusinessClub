<script>

  import { goto } from "$app/navigation";

</script>
<div class="w-screen h-screen flex items-center align-center">
    <div class="w-2/4 card p-8 m-auto  text-center">
        <b on:click={() => goto("/")} class="text-xl uppercase cursor-pointer text-primary-500">Bizz Club</b>

        <input class="input !rounded-md mt-8" title="Input (text)" type="text" placeholder="username" />

        <input class="input !rounded-md my-4" title="Input (password)" type="password" placeholder="password" />
        <a href="/user" class="btn btn-md rounded-md variant-ghost-primary w-full mt-4">Logga in</a>
    </div> 
</div>