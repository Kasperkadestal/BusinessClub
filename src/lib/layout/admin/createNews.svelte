<script lang="ts">
  import { supabase } from "$lib/supabaseClient";
  import { FileDropzone } from "@skeletonlabs/skeleton";

  let title = "";
  let description = "";
  let files: FileList;

  function onChangeHandler(e: Event): void {
    console.log('file data:', e);
  }

  async function postNews() {
    try {
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("Images")
        .upload(`news/${files[0].name}`, files[0]);

      if (error) {
        console.error("Error uploading file to Supabase Storage:", error.message);
        return;
      }

      // Get the public URL of the uploaded file
      const imageUrl = data?.path;

      // Insert the news item into the 'news' table
      const { data: newsData, error: newsError } = await supabase
        .from("news")
        .insert([
          {
            title,
            description,
            image: imageUrl,
          },
        ]);

      if (newsError) {
        console.error("Error inserting news item:", newsError.message);
        return;
      }

      console.log("News item inserted successfully:", newsData);

      // Clear the form fields
      title = "";
      description = "";
      files = new FileList;
    } catch (error) {
      console.error("Error:", error);
    }
  }

</script>

<div class="bg-black/[.25] h-[70vh] p-8 flex flex-col gap-6">
    <label class="label">
        <input bind:value={title} class="input rounded-md" type="text" placeholder="Titel..." />
    </label>
    <label class="label">
        <textarea bind:value={description} class="textarea h-48" rows="4" placeholder="Innehåll..." />
    </label>
    <FileDropzone on:change={onChangeHandler} bind:files={files} name="files">
        <svelte:fragment slot="message">
            {#if !files}
                 Lägg till bild
            {:else}
                {files[0].name}
            {/if}
        </svelte:fragment>
    </FileDropzone>

    <button on:click={postNews} class="btn h-16 mt-10 w-full variant-ghost-primary">
        Skicka nyhet
    </button>
</div>