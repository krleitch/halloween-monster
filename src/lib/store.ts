 import { browser } from '$app/environment';
 import { writable } from 'svelte/store';

 import type { Monster, PlayerMonster, Battlefield } from './types';
 import { init_battlefield, init_players, init_queue } from './setup';

 // PLAYERS
 const storagePlayers = browser && window.localStorage.getItem('players');
 const initialPlayersValue = browser && storagePlayers ? JSON.parse(storagePlayers) : JSON.parse(JSON.stringify(init_players));
 const playersStore = writable<PlayerMonster[]>(initialPlayersValue);
 playersStore.subscribe((value) => {
   if (browser) {
    console.log('saving players')
     window.localStorage.setItem('players', JSON.stringify(value));
   }
 });

// Battlefield
 const storageBattlefield = browser && window.localStorage.getItem('battlefield');
 const initialBattlefieldValue = browser && storageBattlefield ? JSON.parse(storageBattlefield) : JSON.parse(JSON.stringify(init_battlefield));
 const battlefieldStore = writable<Battlefield>(initialBattlefieldValue);
 battlefieldStore.subscribe((value) => {
   if (browser) {
     window.localStorage.setItem('battlefield', JSON.stringify(value));
   }
 });

// Queue
 const storageQueue = browser && window.localStorage.getItem('queue');
 const initialQueueValue = browser && storageQueue ? JSON.parse(storageQueue) : JSON.parse(JSON.stringify(init_queue));
 const queueStore = writable<Monster[]>(initialQueueValue);
 queueStore.subscribe((value) => {
   if (browser) {
     window.localStorage.setItem('queue', JSON.stringify(value));
   }
 });

 export { playersStore, queueStore, battlefieldStore };