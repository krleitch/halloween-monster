<script lang="ts">
    import type { Player, Monster, Item, Action, Log } from "$lib";
	import { init_players, init_battlefield, init_queue } from "$lib";
    import { playersStore, battlefieldStore, queueStore } from '$lib/store';

    // Init Game state
    let battlefield: (Monster | null)[];
    let players: Player[];
    let queue: Monster[];
    let logs: Log[] = [{ message: "Battle Initialized", type: "info"}];

    // STORE
    playersStore.subscribe((val) => {
        players = val;
    });
    queueStore.subscribe((val) => {
        queue = val;
    });
    battlefieldStore.subscribe((val) => {
        battlefield = val;
    });

    // Utilities
    function clearLogs() {
        logs = [];
    }
    function sortVitality() {
        players = players.sort((p1, p2) => {
            return p2.vitality - p1.vitality
        });
        players.forEach((player, index) => {
            player.order = index + 1;
        });
        logs.push({message: "Sorted by VITALITY", type: "sort"});
        logs = logs;
        saveState();
    }
    function sortOrder() {
        players = players.sort((p1, p2) => {
            return p1.order - p2.order
        });
        players.forEach((player, index) => {
            player.order = index + 1;
        });
        logs.push({message: "Sorted by ORDER", type: "sort"});
        logs = logs;
        saveState();
    }

    // GAME STATE
    function resetState() {
        playersStore.set(init_players);
        battlefieldStore.set(init_battlefield);
        queueStore.set(init_queue);
        logs = [{ message: "Battle Initialized", type: "info"}];
    }
    function saveState() {
        playersStore.set(players);
        battlefieldStore.set(battlefield);
        queueStore.set(queue);
    }

    // Check if a monster has Died and replace it
    function battlefieldReplace(player: Player): Item[] {

        let newBattleField: (Monster| null)[] = [null, null, null]
        let drops: Item[] = [];

        battlefield.forEach((monster, index) => {
            if (monster && monster.vitality <= 0) {
                // Monster is dead so replace it
                drops = drops.concat(monster.inventory);
                let topMonster = queue.shift()
                let nextMonster = topMonster ? topMonster : null;
                newBattleField[index] = nextMonster;
                logs.push({message: monster.name + " was killed by " + player.name + " using " + player.action.item, type: "kill"});
            } else {
                // Still alive
                newBattleField[index] = monster;
            }
        });

        // CHECK PLAYER BATTLEFIELD
        const secondLast = players[players.length-2];
        if (secondLast.vitality <= 0 && !secondLast.killed) {
            secondLast.killed = true;
            logs.push({message: secondLast.name + " was killed by " + player.name + " using " + player.action.item, type: "kill"});
            drops = drops.concat(secondLast.inventory);
        }
        const last = players[players.length-1];
        if (last.vitality <= 0 && !last.killed) {
            last.killed = true;
            logs.push({message: last.name + " was killed by " + player.name + " using " + player.action.item, type: "kill"});
            drops = drops.concat(last.inventory);
        }

        // UPDATE
        battlefield = newBattleField;
        saveState();
        drops = drops.filter((drop) => { return drop.name !== "Dagger"});
        return drops;
    }

    // Here it is.....

    function simulate() {
        logs.push({message: "Starting simulation", type: "info"});
        logs = logs;

        // Order is Ice Release > Weapon Damage (Dagger/Double Sword/Grenade/Ice) > Time Bomb > Poison

        for (var i = 0; i < players.length; i++) {
            let action = players[i].action;
            let attackBf: Player | Monster | null = null;
            if (action.battlefield < 4) {
                attackBf = battlefield[action.battlefield-1];
            } else if (action.battlefield == 4) {
                attackBf = players[players.length-2]
            } else if (action.battlefield == 5) {
                attackBf = players[players.length-1]
            }

            // remove item from player
            if (action.item == "Dual Sword") {
                let index = players[i].inventory.findIndex((val) => val.name = "Dual Sword" );
                players[i].inventory.splice(index, 1);
                index = players[i].inventory.findIndex((val) => val.name = "Single Sword" );
                players[i].inventory.splice(index, 1);
            } else if (action.item !== "Dagger") {
                let index = players[i].inventory.findIndex((val) => val.name = action.item );
                players[i].inventory.splice(index, 1);   
            }

            // No monster in battlefield or player is dead so go next
            if (attackBf == null || players[i].killed) {
                continue;
            }

            // Check all battlefields for ICE RELEASE
            for (var j = 0; j < battlefield.length; j++) {
                let monster = battlefield[j];
                if (monster && monster.frozen == players[i].name) {
                    // unfreeze
                    monster.frozen = ""
                }
            };

            // If frozen go next
            if (attackBf.frozen) {
                continue;
            }

            // DEAL Weapon Damage
            switch(action.item) {
                case "Dagger":
                    attackBf.vitality -= 3;
                    break;
                case "Grenade":
                    attackBf.vitality -= 6;
                    break;
                case "Dual Sword":
                    attackBf.vitality -= 4;
                    break;
                case "Single Sword":
                    let attackBfDual: Player | Monster | null = null;
                    if (action.dual < 4) {
                        attackBfDual = battlefield[action.dual-1];
                    } else if (action.dual == 4) {
                        attackBfDual = players[players.length-2]
                    } else if (action.dual == 5) {
                        attackBfDual = players[players.length-1]
                    }
                    attackBf.vitality -= 2;
                    if (attackBfDual && attackBfDual.frozen == "") {
                        attackBfDual.vitality -= 2;
                    }
                    break;
                case "Bomb":
                    attackBf.bombed = players[i].name;
                    break;
                case "Ice":
                    attackBf.vitality -= 3;
                    attackBf.frozen = players[i].name;
                    break;
                case "Poison":
                    attackBf.poisoned = true;
                    break;
                default:
                    // code block
            }

            let drops = battlefieldReplace(players[i])
            if (drops.length > 0) {
                logs.push({message: players[i].name + " looted " + drops.map((d) => d.name).join(", "), type: "loot"});
                players[i].inventory = players[i].inventory.concat(drops);
                drops = [];
            }

            const secondLast = players[players.length-2];
            const last = players[players.length-1];

            // TIMEBOMB
            for (var j = 0; j < battlefield.length; j++) {
                let monster = battlefield[j];
                if (monster && monster.bombed == players[i].name) {
                    // explode
                    monster.bombed = "";
                    monster.vitality -= 10;
                }
            };

            if (secondLast.bombed == players[i].name) {
                secondLast.bombed = "";
                secondLast.vitality -= 10;
            }

            if (last.bombed == players[i].name) {
                last.bombed = "";
                last.vitality -= 10;
            }

            drops = battlefieldReplace(players[i])
            if (drops.length > 0) {
                logs.push({message: players[i].name + " looted " + drops.map((d) => d.name).join(", "), type: "loot"});
                players[i].inventory = players[i].inventory.concat(drops);
                drops = [];
            }

            // POISON
            for (var j = 0; j < battlefield.length; j++) {
                let monster = battlefield[j];
                if (monster && monster.poisoned) {
                    monster.vitality -= 1;
                }
            };
            if (secondLast.poisoned) {
                secondLast.vitality -= 1;
            }
            if (last.poisoned) {
                last.vitality -= 1;
            }

            drops = battlefieldReplace(players[i])
            if (drops.length > 0) {
                logs.push({message: players[i].name + " looted " + drops.map((d) => d.name).join(", "), type: "loot"});
                players[i].inventory = players[i].inventory.concat(drops);
                drops = [];
            }

        };

    }

</script>

<div class="bg-gray-900 p-12 text-gray-100 h-screen max-h-screen">
    
    <div class="flex flex-row space-x-4">

        <!-- Battlefield -->
         <div class="flex flex-row space-x-4 border rounded-xl border-gray-700 p-4">
            {#each battlefield as monster}
                {#if monster}
                    <div class="flex flex-col"> 
                        <span> Name: {monster.name} </span>
                        <span> Vitality: <span class="text-red-400"> {monster.vitality} </span> </span>
                        <span> Frozen: <span class="text-blue-400"> {monster.frozen.length > 0 ? monster.frozen : false} </span> </span>
                        <span> Bomb: <span class="text-yellow-400"> {monster.bombed.length > 0 ? monster.bombed : false} </span> </span>
                        <span> Poison: <span class="text-green-400"> {monster.poisoned} </span> </span>
                        <div class="flex flex-col bg-gray-700 p-2">
                            {#each monster.inventory as item}
                                <span> {item.name}</span>
                            {/each}
                        </div>

                    </div>
                {:else}
                    <div> Empty </div>
                {/if}
            {/each}
         </div>

         <!-- Queue -->
         <div class="flex flex-col space-y-4 border rounded-xl border-gray-700 p-4">
            {#each queue as monster}
                <span> {monster.name}: <span class="text-red-400"> {monster.vitality}</span> </span>
            {/each}
         </div>

          <!-- Log -->
         <div class="flex flex-col space-y-1 border rounded-xl border-gray-700 p-4 w-126">
            {#each logs as log, index}
                <span class="{log.type}"> {index}: {log.message} </span>
            {/each}
         </div>

            <!-- Buttons -->
          <div class="flex flex-col space-y-4">
            <button class="bg-purple-400 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" on:click={resetState}>
                Reset Game
            </button>
            <button class="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" on:click={clearLogs}>
                Clear Logs
            </button>
            <button class="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" on:click={sortVitality}>
                Sort Vitality
            </button>
            <button class="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" on:click={sortOrder}>
                Sort Order
            </button>
            <button class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={simulate}>
                Simulate
            </button>
          </div>

    </div>

    <div class="mt-10 border rounded-xl border-gray-700 p-4">

        <!-- Players -->
        <div class="flex flex-row space-x-2">
            {#each players as player}
                <div class="play flex flex-col border rounded-xl border-gray-700 p-2 min-w-24"> 
                    <span> {player.name} </span>
                    <form class="py-1">
                        <input class="max-w-18 bg-gray-800 text-green-400" type="number" id="order" bind:value={player.order}>
                        <input class="max-w-18 bg-gray-800 text-red-400" type="number" id="vitality" bind:value={player.vitality}>
                    </form>

                    {#if player.killed}
                        <span class=:text-red-400> KILLED </span>
                    {:else}
                        <div class="flex flex-col mt-1">
                            <select class="bg-gray-800" bind:value={player.action.item}>
                                {#each player.inventory as item}
                                    <option value={item.name}>{item.name}</option>
                                {/each}
                            </select>
                            <select class="bg-gray-800" bind:value={player.action.battlefield}>
                                {#each [1,2,3,4,5] as battlefield}
                                    <option value={battlefield}>{battlefield}</option>
                                {/each}
                            </select>

                            <!-- Show the single sword extra battlefield -->
                            {#if player.action.item == "Single Sword"}
                            <select class="bg-gray-800" bind:value={player.action.dual}>
                                {#each [1,2,3,4,5] as battlefield}
                                    <option value={battlefield}>{battlefield}</option>
                                {/each}
                            </select>
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>

    </div>

</div>

<style lang="scss">
    @reference "../app.css";
    .play:nth-last-child(2)
    {
        @apply border-red-400;
    }
    .play:last-child
    {
        @apply border-red-400;
    }

    .info {
        @apply text-gray-400;
    }
    .kill {
        @apply text-red-400;
    }
    .loot {
        @apply text-yellow-400;
    }
    .sort {
        @apply text-pink-400;
    }
</style>