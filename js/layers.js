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
                return player[this.layer].points.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
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
        mult = new Decimal(1)
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
})

