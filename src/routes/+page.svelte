<script lang="ts">
    import type { Player, Monster, Item, Action, Log } from "$lib";
	import { init_players, init_battlefield, init_queue } from "$lib";
    import { playersStore, battlefieldStore, queueStore } from '$lib/store';

    let logs: Log[] = [{ message: "Battle Initialized", type: "info"}];

    // Utilities
    function clearLogs() {
        logs = [];
    }
    function sortVitality() {
        // Save battlefield 4, 5 state before sortings
        const secondLast = $playersStore[$playersStore.length-2];
        const last = $playersStore[$playersStore.length-1];
        const secondLastBomb = secondLast.bombed;
        const secondLastPoisoned = secondLast.poisoned;
        const secondLastFrozen = secondLast.frozen;
        const lastBomb = last.bombed;
        const lastPoisoned = last.poisoned;
        const lastFrozen = last.frozen;

        const newPlayers = $playersStore.sort((p1, p2) => {
            if (p1.killed) {
                return 1
            } else if (p2.killed) {
              return -1  
            } else {
                return p2.vitality - p1.vitality;
            }
        });
        newPlayers.forEach((player, index) => {
            player.order = index + 1;
            player.bombed = "";
            player.poisoned = "";
            player.frozen = "";
        });
        newPlayers[newPlayers.length-2].bombed = secondLastBomb;
        newPlayers[newPlayers.length-2].poisoned = secondLastPoisoned;
        newPlayers[newPlayers.length-2].frozen = secondLastFrozen;
        newPlayers[newPlayers.length-1].bombed = lastBomb;
        newPlayers[newPlayers.length-1].poisoned = lastPoisoned;
        newPlayers[newPlayers.length-1].frozen = lastFrozen;
        logs.push({message: "Sorted by VITALITY", type: "sort"});
        logs = logs;
        playersStore.set(newPlayers)
    }
    function sortOrder() {
        // Save battlefield 4, 5 state before sortings
        const secondLast = $playersStore[$playersStore.length-2];
        const last = $playersStore[$playersStore.length-1];
        const secondLastBomb = secondLast.bombed;
        const secondLastPoisoned = secondLast.poisoned;
        const secondLastFrozen = secondLast.frozen;
        const lastBomb = last.bombed;
        const lastPoisoned = last.poisoned;
        const lastFrozen = last.frozen;

        const newPlayers = $playersStore.sort((p1, p2) => {
            if (p1.killed) {
                return 1
            } else if (p2.killed) {
              return -1  
            } else {
                return p1.order - p2.order;
            }
        });
        newPlayers.forEach((player, index) => {
            player.order = index + 1;
            player.bombed = "";
            player.poisoned = "";
            player.frozen = "";
        });
        newPlayers[newPlayers.length-2].bombed = secondLastBomb;
        newPlayers[newPlayers.length-2].poisoned = secondLastPoisoned;
        newPlayers[newPlayers.length-2].frozen = secondLastFrozen;
        newPlayers[newPlayers.length-1].bombed = lastBomb;
        newPlayers[newPlayers.length-1].poisoned = lastPoisoned;
        newPlayers[newPlayers.length-1].frozen = lastFrozen;
        logs.push({message: "Sorted by ORDER", type: "sort"});
        logs = logs;
        playersStore.set(newPlayers)
    }
    function resetState() {
        // what a fun way to deep copy :)
        playersStore.set(JSON.parse(JSON.stringify(init_players)));
        battlefieldStore.set(JSON.parse(JSON.stringify(init_battlefield)));
        queueStore.set(JSON.parse(JSON.stringify(init_queue)));
        logs = [{ message: "Battle Initialized", type: "info"}];
    }

    // Check if a monster has Died and replace it
    function battlefieldReplace(player: Player, backupPlayers: Player[], bombOwner: string, poisonOwner: string): Item[] {

        let newBattleField: (Monster| null)[] = [null, null, null]
        let drops: Item[] = [];

        $battlefieldStore.forEach((monster, index) => {
            if (monster && monster.vitality <= 0) {
                // Monster is dead so replace it
                drops = drops.concat(monster.inventory);
                let topMonster = $queueStore.shift();
                queueStore.set($queueStore);
                let nextMonster = topMonster ? topMonster : null;
                // transfer the bomb
                if (nextMonster) {
                    nextMonster.bombed = monster.bombed;
                }

                if (bombOwner) {
                    $playersStore.find((val) => val.name == bombOwner)
                } else if (poisonOwner) {

                } else {
                    player.vitality += monster.startVitality;
                    logs.push({message: monster.name + " was killed by " + player.name + " using " + player.action.item, type: "kill"});
                }

                newBattleField[index] = nextMonster;

            } else {
                // Still alive
                newBattleField[index] = monster;
            }
        });

        // CHECK PLAYER BATTLEFIELD
        const secondLast = $playersStore[$playersStore.length-2];
        if (secondLast.vitality <= 0 && !secondLast.killed) {
            secondLast.killed = true;
            logs.push({message: secondLast.name + " was killed by " + player.name + " using " + player.action.item, type: "kill"});
            player.vitality += backupPlayers[backupPlayers.length-2].vitality;
            drops = drops.concat(secondLast.inventory);
        }
        const last = $playersStore[$playersStore.length-1];
        if (last.vitality <= 0 && !last.killed) {
            last.killed = true;
            logs.push({message: last.name + " was killed by " + player.name + " using " + player.action.item, type: "kill"});
            player.vitality += backupPlayers[backupPlayers.length-1].vitality;
            drops = drops.concat(last.inventory);
        }

        // UPDATE
        battlefieldStore.set(newBattleField);
        playersStore.set($playersStore);
        drops = drops.filter((drop) => { return drop.name !== "Dagger"});
        return drops;
    }

    // Here it is.....

    function simulate() {
        logs.push({message: "Starting simulation", type: "info"});
        logs = logs;

        // We need to remember how much health our players had at the start
        const backupPlayers = JSON.parse(JSON.stringify($playersStore));

        // Order is Ice Release > Weapon Damage (Dagger/Double Sword/Grenade/Ice) > Time Bomb > Poison

        for (var i = 0; i < $playersStore.length; i++) {
            let action = $playersStore[i].action;
            let attackBf: Player | Monster | null = null;
            if (action.battlefield < 4) {
                attackBf = $battlefieldStore[action.battlefield-1];
            } else if (action.battlefield == 4) {
                attackBf = $playersStore[$playersStore.length-2]
            } else if (action.battlefield == 5) {
                attackBf = $playersStore[$playersStore.length-1]
            }

            // remove item from player
            if (action.item == "Dual Sword" || action.item == "Single Sword") {
                let index = $playersStore[i].inventory.findIndex((val) => val.name == "Dual Sword" );
                $playersStore[i].inventory.splice(index, 1);
                index = $playersStore[i].inventory.findIndex((val) => val.name == "Single Sword" );
                $playersStore[i].inventory.splice(index, 1);
            } else if (action.item !== "Dagger") {
                let index = $playersStore[i].inventory.findIndex((val) => val.name == action.item );
                $playersStore[i].inventory.splice(index, 1);   
            }

            // No monster in battlefield or player is dead so go next
            if (attackBf == null || $playersStore[i].killed) {
                continue;
            }

            // Check all battlefields for ICE RELEASE
            for (var j = 0; j < $battlefieldStore.length; j++) {
                let monster = $battlefieldStore[j];
                if (monster && monster.frozen == $playersStore[i].name) {
                    // unfreeze
                    monster.frozen = ""
                }
            };

            // DEAL Weapon Damage
            switch(action.item) {
                case "Dagger":
                    if (!attackBf.frozen) {
                        attackBf.vitality -= 3;
                    }
                    break;
                case "Grenade":
                    if (!attackBf.frozen) {
                        attackBf.vitality -= 6;
                    }
                    break;
                case "Dual Sword":
                    if (!attackBf.frozen) {
                        attackBf.vitality -= 4;
                    }
                    break;
                case "Single Sword":
                    let attackBfDual: Player | Monster | null = null;
                    if (action.dual < 4) {
                        attackBfDual = $battlefieldStore[action.dual-1];
                    } else if (action.dual == 4) {
                        attackBfDual = $playersStore[$playersStore.length-2]
                    } else if (action.dual == 5) {
                        attackBfDual = $playersStore[$playersStore.length-1]
                    }
                    if (!attackBf.frozen) {
                        attackBf.vitality -= 2;
                    }
                    if (attackBfDual && attackBfDual.frozen == "") {
                        if (!attackBfDual.frozen) {
                            attackBfDual.vitality -= 2;
                        }
                    }
                    break;
                case "Bomb":
                    attackBf.bombed = $playersStore[i].name;
                    break;
                case "Ice":
                    if (!attackBf.frozen) {
                        attackBf.vitality -= 3;
                    }
                    attackBf.frozen = $playersStore[i].name;
                    break;
                case "Poison":
                    attackBf.poisoned = $playersStore[i].name;
                    break;
                default:
                    // code block
            }

            let drops = battlefieldReplace($playersStore[i], backupPlayers, "", "")
            if (drops.length > 0) {
                logs.push({message: $playersStore[i].name + " looted " + drops.map((d) => d.name).join(", "), type: "loot"});
                $playersStore[i].inventory = $playersStore[i].inventory.concat(drops);
                drops = [];
            }

            const secondLast = $playersStore[$playersStore.length-2];
            const last = $playersStore[$playersStore.length-1];

            // TIMEBOMB
            let bombOwner = "";
            for (var j = 0; j < $battlefieldStore.length; j++) {
                let monster = $battlefieldStore[j];
                if (monster && monster.bombed == $playersStore[i].name) {
                    // explode
                    bombOwner = monster.bombed;
                    monster.bombed = "";
                    if (!attackBf.frozen) {
                        monster.vitality -= 10;
                    }
                }
            };

            if (secondLast.bombed == $playersStore[i].name) {
                bombOwner = secondLast.bombed;
                secondLast.bombed = "";
                if (!secondLast.frozen) {
                    secondLast.vitality -= 10;
                }
            }

            if (last.bombed == $playersStore[i].name) {
                bombOwner = last.bombed;
                last.bombed = "";
                if (!last.frozen) {
                    last.vitality -= 10;
                }
            }

            drops = battlefieldReplace($playersStore[i], backupPlayers, bombOwner, "")
            if (drops.length > 0) {
                logs.push({message: $playersStore[i].name + " looted " + drops.map((d) => d.name).join(", "), type: "loot"});
                $playersStore[i].inventory = $playersStore[i].inventory.concat(drops);
                drops = [];
            }

            // POISON
            let poisonOwner = "";
            for (var j = 0; j < $battlefieldStore.length; j++) {
                let monster = $battlefieldStore[j];
                if (monster && monster.poisoned.length > 0 && !monster.frozen) {
                    monster.vitality -= 1;
                }
            };
            if (secondLast.poisoned.length > 0 && !secondLast.frozen) {
                secondLast.vitality -= 1;
            }
            if (last.poisoned && !secondLast.frozen) {
                last.vitality -= 1;
            }

            drops = battlefieldReplace($playersStore[i], backupPlayers, "", "")
            if (drops.length > 0) {
                logs.push({message: $playersStore[i].name + " looted " + drops.map((d) => d.name).join(", "), type: "loot"});
                $playersStore[i].inventory = $playersStore[i].inventory.concat(drops);
                drops = [];
            }

            // Equip the dagger again
            $playersStore[i].action.item = "Dagger";

        };

    }

</script>

<div class="bg-gray-900 p-12 text-gray-100 h-screen max-h-screen">
    
    <div class="flex flex-row space-x-4">

        <!-- Battlefield -->
         <div class="flex flex-row justify-between space-x-4 border rounded-xl border-gray-700 p-4 w-[750px]">
            {#each $battlefieldStore as monster}
                {#if monster}
                    <div class="flex flex-col"> 
                        <span> Name: {monster.name} </span>
                        <span> Vitality: <span class="text-red-400"> {monster.vitality} </span> </span>
                        <span> Frozen: <span class="text-blue-400"> {monster.frozen.length > 0 ? monster.frozen : false} </span> </span>
                        <span> Bomb: <span class="text-yellow-400"> {monster.bombed.length > 0 ? monster.bombed : false} </span> </span>
                        <span> Poison: <span class="text-green-400"> {monster.poisoned.length > 0 ? monster.poisoned : false} </span> </span>
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
            {#each $queueStore as monster}
                <span> {monster.name}: <span class="text-red-400"> {monster.vitality}</span> </span>
            {/each}
         </div>

          <!-- Log -->
         <div class="flex overflow-auto flex-col space-y-1 border rounded-xl border-gray-700 p-4 w-126 h-[500px] max-h-[500px]">
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
            {#each $playersStore as player}
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