<script lang="ts">
    import type { PlayerMonster, Monster, Item, Action, Log } from "$lib";
	import { init_players, init_battlefield, init_queue } from "$lib";
    import { playersStore, battlefieldStore, queueStore } from "$lib";
    import { sortVitality, sortOrder } from "$lib";

    // Logs
    let logs: Log[] = [{ message: "Battle Initialized", type: "info"}];
    function addLog(message: string, type: "kill" | "loot" | "info" | "sort") {
        logs.push({message: message, type: type});
        // force refresh
        logs = logs;
    }

    // Buttons
    function clearLogsSubmit() {
        logs = [];
    }
    function sortVitalitySubmit() {
        playersStore.set(sortVitality($playersStore))
        addLog("Sorted by VITALITY", "sort");
    }
    function sortOrderSubmit() {
        playersStore.set(sortOrder($playersStore))
        addLog("Sorted by ORDER", "sort");
    }
    function resetGameSubmit() {
        // Deep copy
        playersStore.set(JSON.parse(JSON.stringify(init_players)));
        battlefieldStore.set(JSON.parse(JSON.stringify(init_battlefield)));
        queueStore.set(JSON.parse(JSON.stringify(init_queue)));
        addLog("Battle Initialized", "info");
    }
    function simulateSubmit() {
        addLog("Starting simulation", "info");
    }

</script>

<div class="bg-gray-900 p-12 text-gray-100 min-h-screen min-w-screen h-full w-full">
    
    <div class="flex flex-row space-x-4">

        <!-- Battlefield -->
         <div class="flex flex-row justify-between space-x-4 border rounded-xl border-gray-700 p-4 w-[750px]">
            {#each $battlefieldStore.monsterBf as bf}
                {#if bf.monster}
                    <div class="flex flex-col"> 
                        <span> Name: {bf.monster.name} </span>
                        <span> Vitality: <span class="text-red-400"> {bf.monster.vitality} </span> </span>

                        <!-- Items in play -->
                        {#each bf.items as item}
                            <span> {item.name } ({item.owner}) </span>
                        {/each}

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
                    Simulate
                </button>
            </div>
          </div>
    </div>

    <!-- Players -->
    <div class="mt-10 border rounded-xl border-gray-700 p-4">
        <div class="flex flex-row space-x-2 flex-wrap justify-center">
            {#each $playersStore as player}
                <div class="play flex flex-col border rounded-xl border-gray-700 p-2 m-1 w-24"> 
                    <span> {player.name} </span>
                    <form class="py-1">
                        <input class="max-w-18 bg-gray-800 text-green-400 min-w-full rounded-md" type="number" id="order" bind:value={player.order}>
                        <input class="max-w-18 bg-gray-800 text-red-400 mt-1 min-w-full rounded-md" type="number" id="vitality" bind:value={player.vitality}>
                    </form>

                    {#if player.vitality <= 0}
                        <span class=:text-red-400> KILLED </span>
                    {:else}
                        <div class="flex flex-col mt-1">
                            <select class="bg-gray-800 outline-none text-xs p-1 rounded-md" bind:value={player.action.item}>
                                {#each player.inventory as item}
                                    <option value={item}>{item.name}</option>
                                {/each}
                            </select>
                            <select class="bg-gray-800 outline-none text-xs p-1 mt-1 rounded-md" bind:value={player.action.battlefield}>
                                {#each [1,2,3,4,5] as battlefield}
                                    <option value={battlefield}>{battlefield}</option>
                                {/each}
                            </select>

                            <!-- Show the single sword extra battlefield -->
                            {#if player.action.item.name == "Single Sword"}
                            <select class="bg-gray-800" bind:value={player.action.dualBattlefield}>
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