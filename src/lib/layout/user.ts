import { goto } from "$app/navigation";
import { supabase } from "$lib/supabaseClient";
import { writable } from "svelte/store";

export const session = writable(null);
export const name = writable("")
export async function logout() {
const { error } = await supabase.auth.signOut()
session.set(null);
goto("/");
}

session.subscribe((data) => 
{
    
    if (data != null) {
        name.set(data.first_name + " " + data.last_name); 
    }
});
