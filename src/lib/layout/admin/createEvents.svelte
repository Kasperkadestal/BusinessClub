<script lang="ts">
    import { supabase } from "$lib/supabaseClient";
    import { FileDropzone } from "@skeletonlabs/skeleton";
  
    let title = "";
    let text = ""; // renamed from 'description' to match your DB schema
    let eventDate = ""; // for storing event date
    let files: FileList;
  
    function onChangeHandler(e: Event): void {
      console.log('file data:', e);
    }
  
    async function postEvent() { // function name changed
      try {
        // Insert the event into the 'event' table
        const { data: eventData, error: eventError } = await supabase
          .from("event")
          .insert([
            {
              title,
              text, // changed from description to text
              date: eventDate // inserting the date
            },
          ]);
  
        if (eventError) {
          console.error("Error inserting event:", eventError.message);
          return;
        }
  
        console.log("Event inserted successfully:", eventData);
  
        // Clear the form fields
        title = "";
        text = "";
        eventDate = "";
        files = new FileList();
      } catch (error) {
        console.error("Error:", error);
      }
    }
  
</script>
  
<div class="bg-black/[.25] h-[70vh] p-8 flex flex-col gap-6">
    <label class="label">
        <input bind:value={title} class="input rounded-md" type="text" placeholder="Titel" />
    </label>
    <label class="label">
        <textarea bind:value={text} class="textarea h-48" rows="4" placeholder="Beskrivning" />
    </label>
    <label class="label">
        <input type="date" bind:value={eventDate} class="input rounded-md" placeholder="Datum" />
    </label>
    <button on:click={postEvent} class="btn h-16 mt-10 w-full variant-ghost-primary">
        Skapa event
    </button>
</div>
