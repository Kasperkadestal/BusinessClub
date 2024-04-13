// raffleStore.ts
import { writable } from 'svelte/store';

type Participant = {
  name: string;
};

type Table = {
  id: number;
  seats: number;
  participants: Participant[];
};

const initialTables: Table[] = [
  { id: 1, seats: 3, participants: [] },
  { id: 2, seats: 3, participants: [] },
  // Add more tables as needed
];

export const raffleStore = writable(initialTables);
