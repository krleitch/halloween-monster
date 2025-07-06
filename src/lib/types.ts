
interface Item {
    name: string;
    damage: number;
}

interface Action {
    item: string;
    battlefield: number;
    dual: number; // where the dual swords second strikes. Only shown when Single sword item is selected.
}

interface Player {
    order: number;
    name: string;
    img: string;
    vitality: number;
    inventory: Item[];
    poisoned: boolean;
    frozen: string;
    bombed: string;
    action: Action;
    killed: boolean;
}

interface Monster {
    name: string;
    img: string;
    vitality: number;
    inventory: Item[];
    poisoned: boolean;
    frozen: string;
    bombed: string;
}

interface Log {
    message: string;
    type: "info" | "kill" | "loot" | "sort";
}

export type { Item, Player, Monster, Action, Log }