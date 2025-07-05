<script lang="ts">
    import type { Player, Monster, Item, Action, Log } from "$lib";
	import { init_players, init_battlefield, init_queue } from "$lib";

    // Init Game state
    let battlefield: Monster[] = init_battlefield;
    let players: Player[] = init_players;
    let queue: Monster[] = init_queue;
    // let actions: Action[] = players.map(player => { return {item: "Dagger", battlefield: 1}});
    let logs: Log[] = [{ message: "Battle Initialized", type: "info"}];

    // Utilities
    function sortVitality() {
        players = players.sort((p1, p2) => {
            return p1.vitality - p2.vitality
        });
        players.forEach((player, index) => {
            player.order = index + 1;
        });
        logs.push({message: "Sorted by VITALITY", type: "sort"});
        logs = logs;
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
    }
    function simulate() {
        logs.push({message: "Starting simulation", type: "info"});
        logs = logs;

        // Order is Ice Release > Weapon Damage (Dagger/Double Sword/Grenade/Ice) > Time Bomb > Poison
    }

</script>

<div class="bg-gray-900 p-12 text-gray-100 h-screen max-h-screen">
    
    <div class="flex flex-row space-x-4">

        <!-- Battlefield -->
         <div class="flex flex-row space-x-4 border rounded-xl border-gray-700 p-4">
            {#each battlefield as monster}
                <div class="flex flex-col"> 
                    <span> Name: {monster.name} </span>
                    <span> Vitality: <span class="text-red-400"> {monster.vitality} </span> </span>
                    <div class="flex flex-col bg-gray-700 p-2">
                        {#each monster.inventory as item}
                            <span> {item.name}</span>
                        {/each}
                    </div>

                </div>
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