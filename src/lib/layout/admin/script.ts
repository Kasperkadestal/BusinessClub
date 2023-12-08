import { fakerSV } from "@faker-js/faker";
import { writable } from "svelte/store";

// Function to generate fake users
function generateFakeUsers(count: number) {
    const fakeUsers = [];
    for (let i = 0; i < count; i++) {
      fakeUsers.push({
        userID: i, // Use unique values for userID
        name: fakerSV.person.fullName(),
      });
    }
  
    return fakeUsers;
  }

export const selectedPage = writable(0);
export const selectedNews = writable({
  title: "", description: "", created_at: ""
});

export const storedUsers = generateFakeUsers(15);
export const selectedConversation = writable({
  userID: null,
  name: "",
});
