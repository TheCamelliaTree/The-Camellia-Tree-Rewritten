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
            description: "You created an account to post your music onto. Gain 1 Note/s and unlock new upgrades. (done to prevent softlocking)",
            cost: new Decimal(1),
        },
        12: {
            title: "The First Composition",
            description: "You created your first composition because of your friends begging you to make it, so you did. It isn't too good, but your note gain is doubled.",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade('s', 11) || hasMilestone('p', 0)},
        },
        13: {
            title: "A Great Discovery",
            description: "You discovered Vocaloid, and used the most known vocaloid, Hatsune Miku, to help your songs feel more lively. Hatsune Miku also helps you boost your note gain by how many songs you released.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade('s', 11) || hasMilestone('p', 0)},
            effect() {
                return player[this.layer].points.add(1).pow(0.35)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        14: {
            title: "Social Media",
            description: "You went onto Social Media and created an account under the name 'Cametek,' and soon, your journey begins. Song gain is now boosted by your notes.",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade('s', 11) || hasMilestone('p', 0)},
            effect() {
                let effect = player.points.add(1).pow(0.1)
                if (hasUpgrade('s', 21)) effect = effect.times(upgradeEffect('s', 21))
                return effect
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        15: {
            title: "First Real Song",
            description: "You posted your first actual real song online! The song doesn't sound good though, but who cares. Note gain is boosting itself.",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade('s', 11) || hasMilestone('p', 0)},
            effect() {
                return player.points.add(1).pow(0.2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"},
        },
        21: {
            title: "100 followers",
            description: "Congrats. You got 100 followers on Social Media. 'Social Media' boosted by 100x.",
            cost: new Decimal(2e14),
            unlocked() { return hasUpgrade('p', 14)},
            effect: 100
        },
        22: {
            title: "Discord Server",
            description: "You opened a Discord server for all your fans. Unlock Members and boost note gain by Paroxysms.",
            cost: new Decimal(1e20),
            unlocked() { return hasUpgrade('p', 14)},
            effect() {
                return player.p.points.add(1).pow(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"}
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
        if (hasUpgrade('p', 11)) mult = mult.times(upgradeEffect('p', 11))
        if (hasMilestone('p', 0)) mult = mult.times(10)
        mult = mult.times((buyableEffect('p', 11)).times(x))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (hasMilestone('a', 1)) exp = exp.add(0.1)
        if (hasUpgrade('p', 13)) exp = exp.add(0.171)
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
        let exp = new Decimal(1)
        if (hasMilestone('p', 2)) exp = exp.add(0.1)
        return exp
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
        13: {
            title: "[e-]",
            description: "Track 3 of Paroxysm. Raise song gain by ^1.1VI (get it, because e is a function and 1 is taken away because of the minus sign).",
            cost: new Decimal(4)
        },
        14: {
            title: "Mithril",
            description: "Track 4 of Paroxysm. Unlock new song upgrades and boosts Paroxysm gain by notes.",
            cost: new Decimal(6)
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
        2: {
            requirementDescription: "This function is useful in math, and a song made it even more useful. (4 Songs in Paroxysm)",
            effectDescription: "Lower Paroxysm's base cost by 50, and raises Album gain exponent by 0.1.",
            done() {return player.p.points.gte(4)}
        },
        3: {
            requirementDescription: "This Metal is the strongest in all of Middle Earth, even rare as well. (6 songs in Paroxysm).",
            effectDescription: "Keep Song upgrades on reset and unlock a buyable.",
            done() {return player.p.points.gte(6)}
        },
    },
    buyables: {
        11: {
                title: "Nuclear Fusion",
                unlocked() {
                    return hasMilestone('p', 1)
                },
                cost(x) {
                    return new Decimal(1000).pow(x)
                },
                display() {
                    let amount = getBuyableAmount('p', 11)
                    return `
                    <br /> Your songs are on a Nuclear Driving Ring, causing them to create Nuclear Fusion, which boosts song by 2x due to radiation.
                    <br /><b><h3>Amount:</h3></b> ${formatWhole(amount)}
                    <br /><b><h3>Currently boosting songs by:</h3></b> ${this.effectDisplay(temp.p.buyables[11].effect)}
                    <br /><b><h3>Cost:</h3></b> ${format(temp.p.buyables[11].cost)} Notes`
                },
                canAfford() {
                    return player.points.gte(this.cost())
                },
                buy() {
                    player.points = player.points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                },
                effect(x) {
                    return Decimal.pow(2, x)
                },
                effectDisplay() {return format(buyableEffect(this.layer, this.id))},
            },
            12: {
                title: "Middle-Earth Gifts",
                unlocked() {
                    return hasMilestone('p', 3)
                },
                cost(x) {
                    return new Decimal(10000).pow(x)
                },
                display() {
                    let amount = getBuyableAmount('p', 12)
                    return `
                    <br /> Your notes are as hard as Mithril, making them worth 3x more.
                    <br /><b><h3>Amount:</h3></b> ${formatWhole(amount)}
                    <br /><b><h3>Currently notes are selling for </h3></b><h2> ${this.effectDisplay(temp.p.buyables[11].effect)}</h2><h3> times higher than normal.</h3>
                    <br /><b><h3>Cost:</h3></b> ${format(temp.p.buyables[12].cost)} Notes`
                },
                canAfford() {
                    return player.points.gte(this.cost())
                },
                buy() {
                    player.points = player.points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                },
                effect(x) {
                    return Decimal.pow(3, x)
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
    requires() {
        let requires = new Decimal(5000)
            if (hasMilestone('p', 2)) requires = requires.sub(50)
        return requires
    }, // Can be a function that takes requirement increases into account
    resource: "Paroxysms", // Name of prestige currency
    baseResource: "notes", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.9, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('p', 14)) mult = mult.div(player.points.max(10).log(10)) //div for decrease, times for increase
        return mult
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
addLayer("m", {
    name: "Members",
    symbol: "M",
    startData() { return {                  
        unlocked: true,                     
        points: new Decimal(0), 
        messages: new Decimal(0),            
    }},
    milestones: {
        0: {
            requirementDescription: "First Member! (1 Member who joined)",
            effectDescription: "Wow, your first member joined, having the name Halloweeb#4371, and they started chatting in #general! More people started to join, but their typing was slow... Gain Messages based on Members.",
            done() {return player.m.points.gte(1)},
        },
    },
    tabFormat: {
        "Member Milestones":{
            content: [
                ["display-text", () => "You have " + colored("m", format(player.m.points)) + " people who joined your discord."],
                "prestige-button",
                ["display-text", () => "You have " + colored("m", format(player.m.messages)) + " messages in the discord."],
                "blank",
                "milestones",
            ]
        },
    },
    color: "#7289DA",                       
    resource: "Members",            
    row: 1,
    position: 1,                                 
    baseResource: "Songs",                 
    baseAmount() { return player.s.points },
    requires: new Decimal(1.5e24),              
    type: "normal",                         
    exponent: 0.1, 
    update(diff)  {
        if (hasMilestone('m', 0))  {let messageGain = player.m.points.div(10)
        player.m.messages = player.m.messages.add(messageGain.times(diff))}
    },                    
    gainMult() {                            
        return new Decimal(1)               
    },
    gainExp() {
        return new Decimal(1)
    },
    hotkeys: [
        {key: "m", description: "M: Reset for Members", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() { return hasUpgrade('s', 22) },
})