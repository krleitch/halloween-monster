<script lang="ts">
    import type { PlayerMonster, Item, Action, Log, BfMonster } from "$lib";
	import { init_players, init_battlefield, init_queue } from "$lib";
    import { playersStore, battlefieldStore, queueStore, roundStore } from "$lib";
    import { sortVitality, sortOrder } from "$lib";

    // Logs
    let logs: Log[] = [];
    function addLog(message: string, type: "kill" | "loot" | "info" | "sort") {
        logs.push({message: message, type: type});
        // force refresh
        logs = logs;
    }

    if ($roundStore == 1) {
        addLog("Battle initialized", "info");
    }

    // Buttons
    function clearLogsSubmit() {
        logs = [];
    }
    function sortVitalitySubmit() {
        const newPlayers = sortVitality($playersStore)
        playersStore.set(newPlayers)
        addLog("Sorted by VITALITY", "sort");
    }
    function sortOrderSubmit() {
        const newPlayers = sortOrder($playersStore)
        playersStore.set(newPlayers)
        addLog("Sorted by ORDER", "sort");
    }
    function resetGameSubmit() {
        // Deep copy
        const newPlayers: PlayerMonster[] = JSON.parse(JSON.stringify(init_players));
        newPlayers.forEach((player) => {
            const dagger = player.inventory.find((item) => item.name = "Dagger")
            if (dagger) {
                player.action.item = dagger;
            }
        });
        playersStore.set(newPlayers);
        battlefieldStore.set(JSON.parse(JSON.stringify(init_battlefield)));
        queueStore.set(JSON.parse(JSON.stringify(init_queue)));
        roundStore.set(1);
        clearLogsSubmit();
        addLog("Battle initialized", "info");
    }

    // Checks if any of the battlefields need to be unfrozen
    function checkUnfreeze(playerName: string) {
        // MONSTER BF
        $battlefieldStore.monsterBf.forEach((bf) => {
            bf.items = bf.items.filter((item) => !(item.name == "Ice" && item.owner == playerName))
        });
        // PLAYER BF
        $battlefieldStore.playerBf.forEach((bf) => {
            bf.items = bf.items.filter((item) => !(item.name == "Ice" && item.owner == playerName))
        });
    }

    function checkFrozen(bfMonster: BfMonster): boolean {
        // If Bf has Ice on it then it is frozen
        return bfMonster.items.filter((item) => item.name == "Ice").length > 0;
    }

    function getTargetBf(bf: number): BfMonster | undefined {
        let target: BfMonster | undefined = undefined;
        if (bf == 1) {
            target = $battlefieldStore.monsterBf[0];
        } else if (bf == 2) {
            target = $battlefieldStore.monsterBf[1];
        } else if (bf == 3) {
            target = $battlefieldStore.monsterBf[2];
        } else if (bf == 4) {
            target = $battlefieldStore.playerBf[0];
        } else if (bf == 5) {
            target = $battlefieldStore.playerBf[1];
        }
        return target
    }

    function dealWeaponDamage(action: Action, playerName: string) {

        let target: BfMonster | undefined = getTargetBf(action.battlefield);

        if (target && target.monster) {

            let frozen = checkFrozen(target);

            if (action.item.name == "Dagger" || action.item.name == "Grenade" || action.item.name == "Dual Sword") {
                if (!frozen) {
                    target.monster.vitality -= action.item.damage;
                }
            } else if (action.item.name == "Ice") {
                if (!frozen) {
                    target.monster.vitality -= action.item.damage;
                }
                target.items.push({...action.item, owner: playerName, fresh: true})
            } else if (action.item.name == "Bomb" || action.item.name == "Poison") {
                target.items.push({...action.item, owner: playerName, fresh: true})
            } else if (action.item.name == "Single Sword") {
                let dualTarget: BfMonster | undefined = getTargetBf(action.dualBattlefield);
                if (!frozen) {
                    target.monster.vitality -= action.item.damage;
                }
                if (dualTarget && dualTarget.monster) {
                    let dualTargetFrozen = checkFrozen(dualTarget);
                    if (!dualTargetFrozen) {
                        dualTarget.monster.vitality -= action.item.damage;
                    }
                }
            }
        }
    }

    function removeWeapon(inventory: Item[], name: string) {
        if (name == "Single Sword" || name == "Dual Sword") {
            let index = inventory.findIndex((item) => item.name == "Dual Sword");
            inventory.splice(index, 1);
            let index2 = inventory.findIndex((item) => item.name == "Single Sword");
            inventory.splice(index2, 1);
        } else if (name == "Dagger") {
            // do nothing
        } else {
            let index = inventory.findIndex((item) => item.name == name);
            inventory.splice(index, 1);
        }
    }

    function updateBattlefield(player: PlayerMonster, type: "weapon" | "poison" | "bomb") {

        function updateDead(bf: BfMonster) {
            // Check if dead
            if (bf.monster) {
                // Add the inventory to what has been dropped
                let drops: Item[] = []
                drops = drops.concat(bf.monster.inventory.filter((item) => item.name != "Dagger"))

                // Update the player vitality and maxVitality depending on what killed it
                // bombs only explode on players own turn so its easy
                if (type == "weapon") {
                    addLog(bf.monster.name + " was killed by " + player.name + " with " + player.action.item.name, "kill")
                    player.vitality += bf.monster.maxVitality;
                    player.maxVitality = Math.max(player.maxVitality, player.vitality);
                    // Add the drops to the player
                    if (drops.length > 0) {
                        addLog(player.name + " looted " + drops.map((d) => d.name ).join(", "), "loot");
                        player.inventory = player.inventory.concat(drops);
                    }
                } else if (type == "bomb") {
                    // Same as weapon, just different log
                    addLog(bf.monster.name + " was killed by " + player.name + " with Bomb", "kill")
                    player.vitality += bf.monster.maxVitality;
                    player.maxVitality = Math.max(player.maxVitality, player.vitality);
                    // Add the drops to the player
                    if (drops.length > 0) {
                        addLog(player.name + " looted " + drops.map((d) => d.name ).join(", "), "loot");
                        player.inventory = player.inventory.concat(drops);
                    }
                } else if (type == "poison") {
                    // if multiple poison then which killed it
                    let poisons = bf.items.filter((item) => item.name == "Poison")
                    // rewind the monster vitality to see when it hit 0
                    let start= bf.monster.vitality;
                    let index = 0;
                    while (start < 0) {
                        index += 1;
                        start += 1;
                    }
                    let killer = $playersStore.find((player) => player.name == poisons[index].owner);
                    if (killer) {
                        addLog(bf.monster.name + " was killed by " + killer.name + " with Poison", "kill")
                        killer.vitality += bf.monster.maxVitality;
                        killer.maxVitality = Math.max(player.maxVitality, player.vitality);
                        // Add the drops to the killer
                        if (drops.length > 0) {
                            addLog(killer.name + " looted " + drops.map((d) => d.name ).join(", "), "loot");
                            killer.inventory = killer.inventory.concat(drops);
                        }
                    }
                }
                // remove the poison on a dead monster
                bf.items = bf.items.filter((item) => !(item.name == "Poison"))
            }
        }

        $battlefieldStore.monsterBf.forEach((bf, index) => {
            // Check if dead
            if (bf.monster && bf.monster.vitality <= 0) {
                updateDead(bf);
                // Replace the monster
                let nextMonster = $queueStore.shift();
                queueStore.set($queueStore);
                bf.monster = nextMonster;
                if (bf.monster) {
                    addLog(bf.monster.name + " entered battlefield " + (index+1).toString(), "info")
                } else {
                    addLog("Battlefield " + (index+1).toString() + " is now empty", "info")
                }
            }
        });

        $battlefieldStore.playerBf.forEach((bf) => {
            // Check if dead
            if (bf.monster && bf.monster.vitality <= 0) {
                updateDead(bf)
                // The battlefield is now empty
                bf.monster = undefined;
            }
        });

    }

    function checkBomb(playerName: string) {

        function explodeBomb(bf: BfMonster) {
            // Get the bombs
            const frozen = checkFrozen(bf);
            let bombs = bf.items.filter((item) => item.name == "Bomb" && item.owner == playerName && !item.fresh)
            bombs.forEach((b) => {
                if (bf.monster && !frozen) {
                    bf.monster.vitality -= b.damage;
                }
            });
            // Remove the bombs
            bf.items = bf.items.filter((item) => !(item.name == "Bomb" && item.owner == playerName && !item.fresh))
        }

        $battlefieldStore.monsterBf.forEach((bf) => {
            explodeBomb(bf);
        });

        $battlefieldStore.playerBf.forEach((bf) => {
            explodeBomb(bf);
        });

    }

    function checkPoison() {

        function applyPoison(bf: BfMonster) {
            // Get the Poisons
            const frozen = checkFrozen(bf);
            let poisons = bf.items.filter((item) => item.name == "Poison" && !item.fresh)
            poisons.forEach((p) => {
                if (bf.monster && !frozen) {
                    bf.monster.vitality -= p.damage;
                }
            });
        }

        $battlefieldStore.monsterBf.forEach((bf) => {
            applyPoison(bf);
        });

        $battlefieldStore.playerBf.forEach((bf) => {
            applyPoison(bf);
        });

    }

    //----------------------------------------------------------------------------------------
    // SIMULATE
    //----------------------------------------------------------------------------------------
    function simulateSubmit() {
        addLog("Starting simulation (Round " + $roundStore + ")", "info");
        roundStore.set($roundStore + 1);

        // set players maxVitality to their current vitality
        $playersStore.forEach((player) => {
            player.maxVitality = player.vitality;
        });

        // Add the players to battlefield 4,5
        const playersLength = $playersStore.length;
        const secondLast = $playersStore[playersLength - 2];
        const last = $playersStore[playersLength - 1]
        $battlefieldStore.playerBf[0].monster = secondLast.vitality > 0 ? secondLast : undefined;
        $battlefieldStore.playerBf[1].monster = last.vitality > 0 ? last : undefined;

        // Ice Release > Weapon Damage (Dagger/Double Sword/Grenade/Ice) > Time Bomb > Poison

        $playersStore.forEach((player) => {
            
            checkUnfreeze(player.name);
            dealWeaponDamage(player.action, player.name); // DMG
            removeWeapon(player.inventory, player.action.item.name) 
            // Everytime damage is done we need to update the battlefield
            updateBattlefield(player, "weapon");

            checkBomb(player.name); // DMG
            updateBattlefield(player, "bomb");

            checkPoison(); // DMG
            updateBattlefield(player, "poison");

            // Mark all bombs and poisons not fresh
            // fresh bombs and poisons are not triggered on the turn they are used
            $battlefieldStore.monsterBf.forEach((bf) => {
                bf.items.forEach((item) => {
                    item.fresh = false;
                });
            });
            $battlefieldStore.playerBf.forEach((bf) => {
                bf.items.forEach((item) => {
                    item.fresh = false;
                });
            });
    
        });

        // Equip the Dagger for everyone
        $playersStore.forEach((player) => {
        const dagger = player.inventory.find((item) => item.name = "Dagger")
            if (dagger) {
                player.action.item = dagger;
            }
        });

        // Save the state
        playersStore.set($playersStore);
        battlefieldStore.set($battlefieldStore);
    }

</script>

<div class="bg-gray-900 p-12 text-gray-100 min-h-screen min-w-screen h-full w-full font-roboto">
    
    <div class="flex flex-row space-x-4">

        <!-- Battlefield -->
         <div class="flex flex-row justify-between space-x-4 border rounded-xl border-gray-700 p-4 w-[750px]">
            {#each $battlefieldStore.monsterBf as bf}
                {#if bf.monster}
                    <div class="flex flex-col"> 
                        <img alt="" src={"/src/img/" + bf.monster.img}>
                        <span> Name: {bf.monster.name} </span>
                        <span> Vitality: <span class="text-red-400"> {bf.monster.vitality} </span> </span>

                        <!-- Items in play -->
                        {#each bf.items as item}
                            <span class={item.name}> {item.name} ({item.owner}) </span>
                        {/each}

                    </div>
                {:else}
                    <div class="flex justify-center mt-24 w-[214px]"> Empty </div>
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
         <div class="flex overflow-auto flex-col space-y-1 border rounded-xl border-gray-700 p-4 flex-1 h-[500px] max-h-[500px]">
            {#each logs as log, index}
                <span class="{log.type}"> {index}: {log.message} </span>
            {/each}
         </div>

            <!-- Buttons -->
          <div class="flex flex-col justify-between my-2">
            <div class="flex flex-col space-y-4">
                <button class="bg-purple-400 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" on:click={resetGameSubmit}>
                    Reset Game
                </button>
                <button class="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" on:click={clearLogsSubmit}>
                    Clear Logs
                </button>
            </div>
            <div class="flex flex-col space-y-4">
                <button class="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" on:click={sortVitalitySubmit}>
                    Sort Vitality
                </button>
                <button class="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" on:click={sortOrderSubmit}>
                    Sort Order
                </button>
                <button class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={simulateSubmit}>
                    Simulate {$roundStore}
                </button>
            </div>
          </div>
    </div>

    <!-- Players -->
    <div class="mt-10 border rounded-xl border-gray-700 p-4">
        <div class="flex flex-row space-x-2 flex-wrap justify-center">
            {#if $playersStore.length > 0}
                {#each $playersStore as player}
                    <div class="play flex flex-col border rounded-xl border-gray-700 p-2 m-1 w-24"> 
                        <span> {player.name} </span>
                        <!-- Order and Vitality -->
                        <form class="py-1">
                            <input class="max-w-18 border-transparent focus:border-transparent focus:ring-0 bg-gray-800 text-green-400 min-w-full rounded-md" type="number" id="order" bind:value={player.order}>
                            <input class="max-w-18 border-transparent focus:border-transparent focus:ring-0 bg-gray-800 text-red-400 mt-1 min-w-full rounded-md" type="number" id="vitality" bind:value={player.vitality}>
                        </form>

                        {#if player.vitality <= 0}
                            <span class="flex justify-center m-2 text-red-400"> KILLED </span>
                        {:else}
                            <div class="flex flex-col mt-1">
                                <!-- Player Action-->
                                <select class="bg-gray-800 border-transparent focus:border-transparent focus:ring-0 text-xs p-1 rounded-md" bind:value={player.action.item}>
                                    {#each player.inventory as item}
                                        {#if item.useable}
                                            <option value={item}> {item.name} </option>
                                        {/if}
                                    {/each}
                                </select>
                                <select class="bg-gray-800 border-transparent focus:border-transparent focus:ring-0 text-xs p-1 mt-1 rounded-md" bind:value={player.action.battlefield}>
                                    {#each [1,2,3,4,5] as battlefield}
                                        <option value={battlefield}>{battlefield}</option>
                                    {/each}
                                </select>

                                <!-- Show the single sword extra battlefield -->
                                {#if player.action.item.name == "Single Sword"}
                                <select class="bg-gray-800 border-transparent focus:border-transparent focus:ring-0 text-xs p-1 mt-1 rounded-md" bind:value={player.action.dualBattlefield}>
                                    {#each [1,2,3,4,5] as battlefield}
                                        <option value={battlefield}>{battlefield}</option>
                                    {/each}
                                </select>
                                {/if}

                                <!-- show pieces -->
                                 <div class="mt-1">
                                    {#each player.inventory as item}
                                        {#if !item.useable}
                                            <span class="flex justify-center text-gray-400 text-sm"> {item.name} </span>
                                        {/if}
                                    {/each}
                                 </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
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

    .Poison {
        @apply text-green-400;
    }
    .Bomb {
        @apply text-yellow-400;
    }
    .Ice {
        @apply text-blue-400;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }
</style>