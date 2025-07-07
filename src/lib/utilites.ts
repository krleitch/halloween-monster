import type { PlayerMonster } from "$lib";

function sortVitality(players: PlayerMonster[]): PlayerMonster[] {
    const newPlayers = players.sort((p1, p2) => {
        if (p1.vitality <= 0 && p2.vitality <= 0) {
            return 0;
        } else if (p1.vitality <= 0) {
            return 1
        } else if (p2.vitality <= 0) {
            return -1  
        } else {
            return p2.vitality - p1.vitality;
        }
    });
    newPlayers.forEach((player, index) => {
        player.order = index + 1;
        player.maxVitality = player.vitality;
    });
    return newPlayers;
}

function sortOrder(players: PlayerMonster[]): PlayerMonster[] {
    const newPlayers = players.sort((p1, p2) => {
        if (p1.vitality <= 0 && p2.vitality <= 0) {
            return 0;
        } else if (p1.vitality <= 0) {
            return 1
        } else if (p2.vitality <= 0) {
            return -1  
        } else {
            return p1.order - p2.order;
        }
    });
    newPlayers.forEach((player, index) => {
        player.order = index + 1;
        player.maxVitality = player.vitality;
    });
    return newPlayers;
}

export { sortVitality, sortOrder }