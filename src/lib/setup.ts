import type { Monster, PlayerMonster, Battlefield, Item } from './types';

let JackOLantern: Monster = {
    name: "Jack o’lantern",
    img: "JACK.PNG",
    vitality: 9,
    maxVitality: 9,
    inventory: [{
        name: "Poison",
        damage: 1,
        useable: true,
    }],
}

let TreeMonster: Monster = {
    name: "Tree Monster",
    img: "TREE.PNG",
    vitality: 15,
    maxVitality: 15,
    inventory: [{
        name: "Grenade",
        damage: 6,
        useable: true,
    }, {
        name: "Dual Sword",
        damage: 4,
        useable: true,
    }, {
        name: "Single Sword",
        damage: 2,
        useable: true
    }],
}

let Witch: Monster = {
    name: "Witch",
    img: "WITCH.PNG",
    vitality: 25,
    maxVitality: 25,
    inventory: [{
        name: "Bomb",
        damage: 10,
        useable: true,
    }, {
        name: "Piece W1",
        damage: 0,
        useable: false,
    }],
}

let Vampire: Monster = {
    name: "Vampire",
    img: "VAMPIRE.PNG",
    vitality: 17,
    maxVitality: 17,
    inventory: [{
        name: "Dual Sword",
        damage: 4,
        useable: true,
    }, {
        name: "Single Sword",
        damage: 2,
        useable: true
    },{
        name: "Ice",
        damage: 3,
        useable: true,
    }],
}

let Werewolf: Monster = {
    name: "Werewolf",
    img: "WEREWOLF.PNG",
    vitality: 10,
    maxVitality: 10,
    inventory: [{
        name: "Grenade",
        damage: 6,
        useable: true,
    }],
}

let Mummy: Monster = {
    name: "Mummy",
    img: "MUMMY.PNG",
    vitality: 12,
    maxVitality: 12,
    inventory: [{
        name: "Grenade",
        damage: 6,
        useable: true,
    },{
        name: "Poison",
        damage: 1,
        useable: true,
    }],
}

let Frankenstein: Monster = {
    name: "Frankenstein",
    img: "FRANK.PNG",
    vitality: 15,
    maxVitality: 15,
    inventory: [{
        name: "Dual Sword",
        damage: 4,
        useable: true,
    },{
        name: "Single Sword",
        damage: 2,
        useable: true,
    },{
        name: "Bomb",
        damage: 10,
        useable: true
    }],
}

let Zombie: Monster = {
    name: "Zombie",
    img: "ZOMBIE.PNG",
    vitality: 22,
    maxVitality: 22,
    inventory: [{
        name: "Ice",
        damage: 3,
        useable: true,
    },{
        name: "Grenade",
        damage: 6,
        useable: true,
    }],
}

let Gargoyle: Monster = {
    name: "Gargoyle",
    img: "GARGOYLE.PNG",
    vitality: 15,
    maxVitality: 15,
    inventory: [{
        name: "Bomb",
        damage: 10,
        useable: true,
    }],
}

let Clown: Monster = {
    name: "Clown",
    img: "CLOWN.PNG",
    vitality: 20,
    maxVitality: 20,
    inventory: [{
        name: "Grenade",
        damage: 6,
        useable: true,
    }, {
        name: "Grenade",
        damage: 6,
        useable: true,
    }],
}

let Goblin: Monster = {
    name: "Goblin",
    img: "GOBLIN.PNG",
    vitality: 30,
    maxVitality: 30,
    inventory: [{
        name: "Grenade",
        damage: 6,
        useable: true,
    }, {
        name: "Piece G1",
        damage: 0,
        useable: false,
    }],
}

let Medusa: Monster = {
    name: "Medusa",
    img: "MEDUSA.PNG",
    vitality: 25,
    maxVitality: 25,
    inventory: [{
        name: "Piece M1",
        damage: 0,
        useable: false,
    }],
}

let Reaper: Monster = {
    name: "Reaper",
    img: "REAPER.PNG",
    vitality: 30,
    maxVitality: 30,
    inventory: [{
        name: "Piece R1",
        damage: 0,
        useable: false,
    },{
        name: "Piece R2",
        damage: 0,
        useable: false,
    }],

}

let JanahanDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
}
let NicoleDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
}
let AnabelDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
}
let EricDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let NiveeDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let KarissaDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let IsaacDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let VinceDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let RonelDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let ZiDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let HarrietDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let JakeDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let KhalilDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let KhrystaDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let KayeDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let PritDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 
let AndrewDagger: Item = {
    name: "Dagger",
    damage: 3,
    useable: true
} 

let init_players: PlayerMonster[] = [
    {
        order: 1,
        name: "Janahan",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [JanahanDagger],
        action: {
            item: JanahanDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 2,
        name: "Nicole",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [NicoleDagger],
        action: {
            item: NicoleDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 3,
        name: "Anabel",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [AnabelDagger],
        action: {
            item: AnabelDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 4,
        name: "Eric",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [EricDagger],
        action: {
            item: EricDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 5,
        name: "Nivee",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [NiveeDagger],
        action: {
            item: NiveeDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 6,
        name: "Karissa",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [KarissaDagger],
        action: {
            item: KarissaDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 7,
        name: "Isaac",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [IsaacDagger],
        action: {
            item: IsaacDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 8,
        name: "Vince",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [VinceDagger],
        action: {
            item: VinceDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 9,
        name: "Ronel",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [RonelDagger],
        action: {
            item: RonelDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 10,
        name: "Zi",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [ZiDagger],
        action: {
            item: ZiDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 11,
        name: "Harriet",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [HarrietDagger],
        action: {
            item: HarrietDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 12,
        name: "Jake",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [JakeDagger],
        action: {
            item: JakeDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 13,
        name: "Khalil",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [KhalilDagger],
        action: {
            item: KhalilDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 14,
        name: "Khrysta",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [KhrystaDagger],
        action: {
            item: KhrystaDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 15,
        name: "Kaye",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [KayeDagger],
        action: {
            item: KayeDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 16,
        name: "Prit",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [PritDagger],
        action: {
            item: PritDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
    {
        order: 17,
        name: "Andrew",
        img: "",
        vitality: 5,
        maxVitality: 5,
        inventory: [AndrewDagger],
        action: {
            item: AndrewDagger,
            battlefield: 1,
            dualBattlefield : 1
        },
        killed: false,
    },
]

let init_battlefield: Battlefield = {
    monsterBf: [
        {monster: JackOLantern, items: []},
        {monster: TreeMonster, items: []},
        {monster: Witch, items: []},
    ],
    playerBf: [
        {monster: undefined, items: []},
        {monster: undefined, items: []},
    ]
}
let init_queue: Monster[] = [Vampire, Werewolf, Mummy, Frankenstein, Zombie, Gargoyle, Clown, Goblin, Medusa, Reaper]

export { init_players, init_battlefield, init_queue }