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
        15: {
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
                ["display-text", () => "You have created " + colored("s", format(player.s.points)) + " songs on your computer."],
                "prestige-button",
                "blank",
                "upgrades",
            ]
        },
        "Milestones": {
            content: [
                ["display-text", () => "You have created " + colored("s", format(player.s.points)) + " songs on your computer."],
                "prestige-button",
                "blank",
                "milestones",
            ]
        },
    },
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= layers[this.layer].row) return;
      
        let keep = [];
        if (hasMilestone('p', 3)) keep.push("upgrades");
        layerDataReset(this.layer, keep);
      },
    color: "#1F1E33",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "songs", // Name of prestige currency
    baseResource: "notes", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('s', 14)) mult = mult.times(upgradeEffect('s', 14))
        if (hasUpgrade('p', 0)) mult = mult.times(upgradeEffect('p', 0))
        if (hasMilestone('p', 0)) mult = mult.times(10)
        mult = mult.times((buyableEffect('p', 11)).times(x))
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
        11: {
            title: "Ring",
            description: "Track 1 of Paroxysm. Boosts song gain by Paroxysms.",
            cost: new Decimal(1),
            effect() {
                return player[this.layer].points.add(1).pow(0.75)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        12: {
            title: "Nuclear Drive",
            description: "Track 2 of Paroxysm. Note gain boosted by ^1.05.",
            cost: new Decimal(2),
        },
    },
    milestones: {
        0: {
            requirementDescription: "This song rings in your ears like echos. (1 Song in Paroxysm)",
            effectDescription: "Passively gain 1 note/s regardless if you have the first upgrade, and song gain is boosted by 10x.",
            done() {return player.p.points.gte(1)}
        },
        1: {
            requirementDescription: "You created a nuclear driving power plant that powered multiple cities. (2 Songs in Paroxysm)",
            effectDescription: "Unlocks a Buyable.",
            done() {return player.p.points.gte(2)}
        },
    },
    buyables: {
        11: {
                title: "Nuclear Fusion",
                unlocked() {
                    return hasMilestone('p', 1)
                },
                cost(x) {
                    return ((x.times(2)).times(100))
                },
                display() {
                    let amount = getBuyableAmount('p', 11)
                    return `
                    <br>${data.display}
                    <br>
                    <br><b>Amount:</b> ${formatWhole(amount))}
                    <br>
                    `
                },
                canAfford() {
                    return player.points.gte(this.cost())
                },
                buy() {
                    player.points = player.points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                },
                effect() {
                    return Decimal.pow(2, x)
                },
                effectDisplay() {return format(buyableEffect(this.layer, this.id))},
            },
        },
    tabFormat: {
        "Upgrades":{
            content: [
                ["display-text", () => "You have created " + colored("p", format(player.p.points)) + " songs for Paraxysm."],
                "prestige-button",
                "blank",
                "upgrades",
            ]
        },
        "Milestones": {
            content: [
                ["display-text", () => "You have created " + colored("p", format(player.p.points)) + " songs for Paroxysm."],
                "prestige-button",
                "blank",
                "milestones",
            ]
        },
        "Buyables": {
            unlocked() {
                return hasMilestone('p', 1)
            },
            content:[
                ["display-text", () => "You have created " + colored("p", format(player.p.points)) + " songs for Paroxysm."],
                "prestige-button",
                "blank",
                "buyables",
            ]
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