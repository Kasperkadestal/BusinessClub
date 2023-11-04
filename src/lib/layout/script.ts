import { writable } from "svelte/store";
import { faker } from "@faker-js/faker";

// Function to generate fake users
function generateFakeUsers(count: number) {
    const fakeUsers = [];
    for (let i = 0; i < count; i++) {
      fakeUsers.push({
        userID: i, // Use unique values for userID
        name: faker.person.fullName(),
      });
    }

    return fakeUsers;
  }

export const selectedPage = writable(0);
export const storedUsers = generateFakeUsers(15);