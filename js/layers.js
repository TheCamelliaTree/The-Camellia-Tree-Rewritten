addLayer("s", {
    name: "songs", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    upgrades: {
        11: {
            title: "A new artist has risen...",
            description: "You created an account to post your music onto. Gain 1 Note/s",
            cost: new Decimal(1),
        },
        12: {
            title: "The First Composition",
            description: "You created your first composition because of your friends begging you to make it, so you did. It isn't too good, but your note gain is doubled.",
            cost: new Decimal(2),
        },
        13: {
            title: "A Great Discovery",
            description: "You discovered Vocaloid, and used the most known vocaloid, Hatsune Miku, to help your songs feel more lively. Hatsune Miku also helps you boost your note gain by how many songs you released.",
            cost: new Decimal(3),
            effect() {
                return player[this.layer].points.add(1).pow(0.35)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        14: {
            title: "Social Media",
            description: "You went onto Social Media and created an account under the name 'Cametek,' and soon, your journey begins. Song gain is now boosted by your notes.",
            cost: new Decimal(5),
            effect() {
                return player.points.add(1).pow(0.1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        21: {
            title: "First Real Song",
            description: "You posted your first actual real song online! The song doesn't sound good though, but who cares. Note gain is boosting itself.",
            cost: new Decimal(10),
            effect() {
                return player.points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        22: {
            title: "CD Disk Time",
            description: "You decided to do the unthinkable. You decided to release a CD Disk. Unlock Albums.",
            cost: new Decimal(50)
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
        if (hasUpgrade('s', 14)) mult = mult.times(upgradeEffect('s', 14))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
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
        unlocked: true,
		points: new Decimal(250),
    }},
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "albums", // Name of prestige currency
    baseResource: "songs", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.0001, // Prestige currency exponent
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
    layerShown(){return hasUpgrade('s', 22)}
})
