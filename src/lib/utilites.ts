import type { PlayerMonster, Monster, Item, Action, Log } from "$lib";

function sortVitality(players: PlayerMonster[]): PlayerMonster[] {
    const newPlayers = players.sort((p1, p2) => {
        if (p1.vitality <= 0) {
            return 1
        } else if (p2.vitality <= 0) {
            return -1  
        } else {
            return p2.vitality - p1.vitality;
        }
    });
    newPlayers.forEach((player, index) => {
        player.order = index + 1;
    });
    return newPlayers;
}

function sortOrder(players: PlayerMonster[]): PlayerMonster[] {
    const newPlayers = players.sort((p1, p2) => {
        if (p1.vitality <= 0) {
            return 1
        } else if (p2.vitality <= 0) {
            return -1  
        } else {
            return p2.order - p1.order;
        }
    });
    newPlayers.forEach((player, index) => {
        player.order = index + 1;
    });
    return newPlayers;
}

export { sortVitality, sortOrder }