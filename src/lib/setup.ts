import type { Monster, Player } from './types';

let JackOLantern: Monster = {
    name: "Jack o’lantern",
    img: "",
    vitality: 9,
    inventory: [{
        name: "Poison",
        damage: 1
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let TreeMonster: Monster = {
    name: "Tree Monster",
    img: "",
    vitality: 15,
    inventory: [{
        name: "Grenade",
        damage: 6
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Witch: Monster = {
    name: "Witch",
    img: "",
    vitality: 25,
    inventory: [{
        name: "Bomb",
        damage: 10
    }, {
        name: "Piece W1",
        damage: 0
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Vampire: Monster = {
    name: "Vampire",
    img: "",
    vitality: 17,
    inventory: [{
        name: "Dual Sword",
        damage: 4
    }, {
        name: "Single Sword",
        damage: 2
    },{
        name: "Ice",
        damage: 3
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Werewolf: Monster = {
    name: "Werewolf",
    img: "",
    vitality: 10,
    inventory: [{
        name: "Grenade",
        damage: 6
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Mummy: Monster = {
    name: "Mummy",
    img: "",
    vitality: 12,
    inventory: [{
        name: "Grenade",
        damage: 6
    },{
        name: "Poison",
        damage: 1
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Frankenstein: Monster = {
    name: "Frankenstein",
    img: "",
    vitality: 15,
    inventory: [{
        name: "Dual Sword",
        damage: 4
    },{
        name: "Single Sword",
        damage: 2
    },{
        name: "Bomb",
        damage: 10
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Zombie: Monster = {
    name: "Frankenstein",
    img: "",
    vitality: 22,
    inventory: [{
        name: "Ice",
        damage: 3
    },{
        name: "Grenade",
        damage: 6
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Gargoyle: Monster = {
    name: "Gargoyle",
    img: "",
    vitality: 15,
    inventory: [{
        name: "Bomb",
        damage: 10
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Clown: Monster = {
    name: "Clown",
    img: "",
    vitality: 20,
    inventory: [{
        name: "Grenade",
        damage: 6
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Goblin: Monster = {
    name: "Goblin",
    img: "",
    vitality: 30,
    inventory: [{
        name: "Grenade",
        damage: 6
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Medusa: Monster = {
    name: "Medusa",
    img: "",
    vitality: 25,
    inventory: [{
        name: "Piece M1",
        damage: 0
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let Reaper: Monster = {
    name: "Reaper",
    img: "",
    vitality: 30,
    inventory: [{
        name: "Piece R1",
        damage: 0
    },{
        name: "Piece R2",
        damage: 0
    }],
    poisoned: false,
    frozen: "",
    bombed: "",
}

let init_players: Player[] = [
    {
        order: 1,
        name: "Janahan",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },
    {
        order: 2,
        name: "Nicole",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },
    {
        order: 3,
        name: "Anabel",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },
    {
        order: 4,
        name: "Eric",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },
    {
        order: 5,
        name: "Nivee",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 6,
        name: "Karissa",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 7,
        name: "Isaac",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 8,
        name: "Vince",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 9,
        name: "Ronel",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 10,
        name: "Zi",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 11,
        name: "Harriet",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 12,
        name: "Jake",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 13,
        name: "Khalil",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 14,
        name: "Krysta",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 15,
        name: "Kaye",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 16,
        name: "Prit",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },{
        order: 17,
        name: "Andrew",
        img: "",
        vitality: 5,
        inventory: [{
            name: "Dagger",
            damage: 3
        }],
        poisoned: false,
        frozen: "",
        bombed: "",
        action: {
            item: "Dagger",
            battlefield: 1,
            dual : 0
        }
    },
]

let init_battlefield: Monster[] = [JackOLantern, TreeMonster, Witch]
let init_queue: Monster[] = [Vampire, Werewolf, Mummy, Frankenstein, Zombie, Gargoyle, Clown, Goblin, Medusa, Reaper]

export { init_players, init_battlefield, init_queue }