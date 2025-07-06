
type Item = {
    name: "Dagger" | "Poison" | "Dual Sword" | "Single Sword" | "Ice" | "Bomb" | "Grenade" | "Piece W1" | "Piece M1" | "Piece R1" | "Piece R2";
    damage: number;
    useable: boolean; // We cannot use Pieces as an action
}

type Action = {
    item: Item;
    battlefield: 1 | 2 | 3 | 4 | 5;
    dualBattlefield: 1 | 2 | 3 | 4 | 5; // Where the dual swords second strikes. Only shown when Single sword item is selected.
}

type Monster = {
    name: string;
    img: string;
    maxVitality: number;
    vitality: number;
    inventory: Item[];
}

type PlayerMonster = Monster & {
    order: number;
    action: Action;
}

type BfMonster = {
    monster: Monster | undefined
    items: (Item & {owner: string})[]
}

type Battlefield = {
    monsterBf: [BfMonster, BfMonster, BfMonster]
    playerBf: [BfMonster, BfMonster]
}

type Log = {
    message: string;
    type: "info" | "kill" | "loot" | "sort";
}

export type { Item, Monster, PlayerMonster, Battlefield, Action, Log, BfMonster }