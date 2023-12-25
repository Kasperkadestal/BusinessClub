import { goto } from "$app/navigation";
import { supabase } from "$lib/supabaseClient";
import { writable } from "svelte/store";

const user = {
    id: "",
    first_name: "",
    last_name: "",
}

export const users = writable(<any>[]);
export const conversations = writable(<any>[]);
export const session = writable(user);
export const name = writable("")
export async function logout() {
const { error } = await supabase.auth.signOut()
goto("/");
}

session.subscribe((data) => 
{
    
    if (data != null) {
        name.set(data.first_name + " " + data.last_name); 
    }
});
