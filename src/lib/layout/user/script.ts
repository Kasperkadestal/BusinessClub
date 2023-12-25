import { writable } from "svelte/store";

export const selectedPage = writable(0);
export const selectedNews = writable({
  title: "",
  description: "",
  created_at: "",
});

export const selectedConversation = writable({
  user1_id: "",
  user2_id: "",
  name: "",
});
