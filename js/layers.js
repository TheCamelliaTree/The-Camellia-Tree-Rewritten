addLayer("s", {
    name: "songs", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    upgrades: {
        0: {
            title: "A new artist has risen...",
            description: "You created an account to post your music onto. Gain 1 Note/s",
            cost: new Decimal(1),
        },
        1: {
            title: "The First Composition",
            description: "You created your first composition because of your friends begging you to make it, so you did. It isn't too good, but your note gain is doubled.",
            cost: new Decimal(2),
        },
        2: {
            title: "A Great Discovery",
            description: "You discovered Vocaloid, and used the most known vocaloid, Hatsune Miku, to help your songs feel more lively. Hatsune Miku also helps you boost your note gain by how many songs you released.",
            cost: new Decimal(3),
            effect() {
                return player[this.layer].points.add(1).pow(0.35)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        3: {
            title: "Social Media",
            description: "You went onto Social Media and created an account under the name 'Cametek,' and soon, your journey begins. Song gain is now boosted by your notes.",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        4: {
            title: "First Real Song",
            description: "You posted your first actual real song online! The song doesn't sound good though, but who cares. Note gain is boosting itself.",
            cost: new Decimal(10),
            effect() {
                return player.points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
    },
    milestones: {
        0: {
            requirementDescription: "50 Songs",
            effectDescription: "Unlock Albums",
            done() {return player.s.points.gte(50)},
        },
    },
    tabFormat: {
        "Upgrades":{
            content: [
                ["display-text",
                    function() { return 'You have created ' + format(player.s.points) + ' songs on your computer'},
                    { "color": "#426FB8", "font-size": "16px", "font-family": "Inconsolata"},],
                "prestige-button",
                "blank",
                ["row", [
                    ["upgrade", 0], ["upgrade", 1], ["upgrade", 2], ["upgrade", 3], ["upgrade", 4],
            ]]
            ]
        },
        "Milestones": {
            content: [
                ["display-text",
                    function() { return 'You have created ' + format(player.s.points) + ' songs on your computer'},
                    { "color": "#426FB8", "font-size": "16px", "font-family": "Inconsolata"},],
                "prestige-button",
                "blank",
                "milestones",
            ]
        },
    },
    color: "#426FB8",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "songs", // Name of prestige currency
    baseResource: "notes", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('s', 3)) mult = mult.times(upgradeEffect('s', 3))
        if (hasUpgrade('p', 0)) mult = mult.times(upgradeEffect('p', 0))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (hasMilestone('a', 1)) exp = exp.add(0.1)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Create a Song", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}
}),
addLayer("a", {
    name: "albums", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    milestones: {
        0: {
            requirementDescription: "1 Album",
            effectDescription: "Unlock the Paroxysm Layer.",
            done() {return player.a.points.gte(1)},
        },
        1: {
            requirementDescription: "2 Albums",
            effectDescription: "Song gain boosted by ^1.1",
            done() {return player.a.points.gte(2)}
        },
    },
    effect(){
        return Decimal.pow(10, player[this.layer].points)
    },
    effectDescription(){
        return "multiplying note gain by " + format(tmp[this.layer].effect)
    },
    color: "#FFFFFF",
    requires: new Decimal(200), // Can be a function that takes requirement increases into account
    resource: "albums", // Name of prestige currency
    baseResource: "songs", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 7.27, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        return new Decimal(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "a", description: "A: Create an Album", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone('s', 0) || player.a.unlocked}
})
addLayer("p", {
    name: "paraxysm", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    upgrades: {
        0: {
            title: "Ring",
            description: "Track 1 of Paroxysm. Boosts song gain by Paroxysms.",
            cost: new Decimal(1),
            effect() {
                return player[this.layer].points.add(1).pow(0.75)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
    },
    color: "#DF6079",
    requires: new Decimal(5000), // Can be a function that takes requirement increases into account
    resource: "Paroxysms", // Name of prestige currency
    baseResource: "notes", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        return new Decimal(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Paraxysms", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone('a', 0) || player.p.unlocked}
})