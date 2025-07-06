 import { browser } from '$app/environment';
 import { writable } from 'svelte/store';
 import type { Monster, Player } from './types';
 import { init_battlefield, init_players, init_queue } from './setup';

 // PLAYERS
 const storagePlayers = browser && window.localStorage.getItem('players');
 const initialPlayersValue = browser && storagePlayers ? JSON.parse(storagePlayers) : init_players;
 const playersStore = writable<Player[]>(initialPlayersValue);
 playersStore.subscribe((value) => {
   if (browser) {
     window.localStorage.setItem('players', JSON.stringify(value));
   }
 });

// Battlefield
 const storageBattlefield = browser && window.localStorage.getItem('battlefield');
 const initialBattlefieldValue = browser && storageBattlefield ? JSON.parse(storageBattlefield) : init_battlefield;
 const battlefieldStore = writable<(Monster | null)[]>(initialBattlefieldValue);
 battlefieldStore.subscribe((value) => {
   if (browser) {
     window.localStorage.setItem('battlefield', JSON.stringify(value));
   }
 });

// Queue
 const storageQueue = browser && window.localStorage.getItem('queue');
 const initialQueueValue = browser && storageQueue ? JSON.parse(storageQueue) : init_queue;
 const queueStore = writable<Monster[]>(initialQueueValue);
 queueStore.subscribe((value) => {
   if (browser) {
     window.localStorage.setItem('queue', JSON.stringify(value));
   }
 });

 export { playersStore, queueStore, battlefieldStore };