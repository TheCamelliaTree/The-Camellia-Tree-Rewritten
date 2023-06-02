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
        23: {
            title: "Paroxysmal Note Boost",
            description: "Your note gain was kinda concerning your fans, but your discord members were willing to help! Boost note gain by Members.",
            cost: new Decimal(2.3e23),
            unlocked() { return hasUpgrade('p', 14)},
            effect() {
                return player.m.points.add(1).times(2)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x"}
        },
        24: {
            title: "Fastest Boost",
            description: "Note gain is boosted by Paroxysm's 5th milestone number (1672x).",
            cost: new Decimal(1e24),
            unlocked() { return hasUpgrade('p', 14)},
        },
    },
    milestones: {
        0: {
            requirementDescription: "50 Songs",
            effectDescription: "Unlock Albums and boost song gain by 5x",
            done() {return player.s.points.gte(50)},
        },
        1: {
            requirementDescription: "Worthy. (1e100 songs)",
            effectDescription: "Unlock Artists.",
            done() {return player.s.points.gte(1e100)},
            unlocked() {return hasMilestone('p', 7)}
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
        if (hasMilestone('p', 3)) keep.push("milestones");
        layerDataReset(this.layer, keep);
      },
    color: "#3BB311",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "songs", // Name of prestige currency
    baseResource: "notes", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    softcap: new Decimal(1e20),
    softcapPower: new Decimal(0.25),
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (!inChallenge('b', 12)) mult = mult.times((buyableEffect('p', 11)))
        if (!inChallenge('b', 12)) mult = mult.times(tmp.p.effect)
        if (hasMilestone('s', 0)) mult = mult.times(5)
        if (hasUpgrade('s', 14)) mult = mult.times(upgradeEffect('s', 14))
        if (hasUpgrade('p', 11) && !inChallenge('b', 12)) mult = mult.times(upgradeEffect('p', 11))
        if (hasMilestone('p', 0) && !inChallenge('b', 12)) mult = mult.times(10)
        if (hasMilestone('b', 1)) mult = mult.times(100)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (hasMilestone('a', 1)) exp = exp.add(0.1)
        if (hasUpgrade('p', 13) && !inChallenge('b', 12)) exp = exp.add(0.71)
        if (hasUpgrade('m', 14)) exp = exp.add(0.1)
        if (hasMilestone('b', 3)) exp = exp.add(0.222)
        return exp
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Create a Song", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    passiveGeneration() {return hasMilestone('p', 4) ? 0.1 : 0},
    layerShown(){return true}
}),
addLayer("a", {
    name: "albums", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "AB", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    milestones: {
        0: {
            requirementDescription: "paroxysm (1 Album)",
            effectDescription: "Unlock the Paroxysm Layer.",
            done() {return player.a.points.gte(1)},
        },
        1: {
            requirementDescription: "Boost! (2 Albums)",
            effectDescription: "Song gain boosted by ^1.1",
            done() {return player.a.points.gte(2)}
        },
        2: {
            requirementDescription: "[diffraction] (3 Albums)",
            effectDescription: "Unlock the [diffraction] Layer.",
            done() {return player.a.points.gte(3)}
        },
    },
    effect(){
        return Decimal.pow(10, player[this.layer].points)
    },
    effectDescription(){
        return "multiplying note gain by " + format(tmp[this.layer].effect)
    },
    color: "#FFFFFF",
    requires() {let requires = new Decimal(200)
            if (hasUpgrade('m', 11)) requires = requires.sub(50)
            return requires
    }, // Can be a function that takes requirement increases into account
    resource: "albums", // Name of prestige currency
    baseResource: "songs", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 9, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        return new Decimal(1)
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let exp = new Decimal(1)
        if (hasMilestone('p', 2) && !inChallenge('b', 12)) exp = exp.add(0.1)
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
    effect() { let effect = new Decimal(1)
        if (hasMilestone('p', 5) && !inChallenge('b', 12)) effect = player.p.points.times(4).max(1)
        return effect
    },
    effectDescription() {
        if (!hasMilestone('p', 5)) return
        return "multiplying song gain by "+ format(tmp[this.layer].effect)
    },
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
            description: "Track 3 of Paroxysm. Raise song gain by ^1.71 (get it, because e is a function and 1 is taken away because of the minus sign).",
            cost: new Decimal(4)
        },
        14: {
            title: "Mithril",
            description: "Track 4 of Paroxysm. Unlock new song upgrades and boosts Paroxysm gain by notes.",
            cost: new Decimal(6)
        },
        21: {
            title: "Fastest Crash",
            description: "Track 5 of Paroxysm. Boost Message gain by Paroxysms.",
            cost: new Decimal(12)
        },
        22: {
            title: "Paroxysm",
            description: "Track 6 of, well, Paroxysm. Raise message gain to ^1.25.",
            cost: new Decimal(13)
        },
        23: {
            title: "Bug Collection",
            description: "This is getting boring, but Track 7 of Paroxysm. Raise message gain to ^1.25 again! (because why not :D)",
            cost: new Decimal(14),
        },
        24: {
            title: "#include",
            description: "The Final Track of Paroxysm. Raise note gain ^(Paroxysms/200)",
            cost: new Decimal(20),
            effect() {
                return player[this.layer].points.div(200).add(1)
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))},
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
        4: {
            requirementDescription: "You have performed the fastest crash ever recorded of 1672 MPH. (12 Songs in Paroxysm)",
            effectDescription: "Passively gain 10% of song gain per second.",
            done() {return player.p.points.gte(12)}
        },
        5: {
            requirementDescription: "This song made you have a sudden violent feeling of Paroxysm. (13 Songs in Paroxysm)",
            effectDescription: "Paroxysms now have an effect.",
            done() {return player.p.points.gte(13)}
        },
        6: {
            requirementDescription: "A bug collection started to collect on your computer, causing an unknown song to appear. (14 Songs in Paroxysm)",
            effectDescription: "Paroxysms are now auto-buy-maxed, and reset nothing.",
            done() {return player.p.points.gte(14)}
        },
        7: {
            requirementDescription: "#include ^layer.completion^ (20 Songs in Paroxysm)",
            effectDescription: "Finish this layer, and Paroxysm buyables are now auto-bought.",
            done() {return player.p.points.gte(20)},
        },
    },
    buyables: {
        11: {
                title: "Nuclear Fusion",
                unlocked() {
                    return hasMilestone('p', 1) && !inChallenge('b', 12)
                },
                cost(x) {
                    return new Decimal(1000).pow(x)
                },
                display() {
                    let amount = getBuyableAmount('p', 11)
                    return `
                    <br /> Your songs are on a Nuclear Driving Ring, causing them to create Nuclear Fusion, which boosts song by 2x due to radiation.
                    <br /><b><h3>Amount:</h3></b> ${formatWhole(amount)}
                    <br /><b><h3>Currently boosting songs by </h3></b><h2> ${this.effectDisplay(temp.p.buyables[11].effect)}</h2><h3> due to radiation.</h3>
                    <br /><b><h3>Cost:</h3></b> ${format(temp.p.buyables[11].cost)} Notes`
                },
                canAfford() {
                    return player.points.gte(this.cost())
                },
                buy() {
                    player.points = player.points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                },
                effect() { return Decimal.pow(2, getBuyableAmount(this.layer, this.id))
                },
                effectDisplay() {return format(buyableEffect(this.layer, this.id))},
                buyMax() {return hasMilestone('p', 7) ? true : false},
            },
            12: {
                title: "Middle-Earth Gifts",
                unlocked() {
                    return hasMilestone('p', 3) && !inChallenge('b', 12)
                },
                cost(x) {
                    return new Decimal(10000).pow(x)
                },
                display() {
                    let amount = getBuyableAmount('p', 12)
                    return `
                    <br /> Your notes are as hard as Mithril, making them worth 3x more.
                    <br /><b><h3>Amount:</h3></b> ${formatWhole(amount)}
                    <br /><b><h3>Currently notes are selling for </h3></b><h2> ${this.effectDisplay(temp.p.buyables[12].effect)}</h2><h3> times higher than normal.</h3>
                    <br /><b><h3>Cost:</h3></b> ${format(temp.p.buyables[12].cost)} Notes`
                },
                canAfford() {
                    return player.points.gte(this.cost())
                },
                buy() {
                    player.points = player.points.sub(this.cost())
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                },
                effect() { return Decimal.pow(3, getBuyableAmount(this.layer, this.id))
                },
                effectDisplay() {return format(buyableEffect(this.layer, this.id))},
                buyMax() {return hasMilestone('p', 7) ? true : false},
            },
        },
    tabFormat: {
        "Upgrades":{
            content: [
                ["display-text", () => `You have created ${colored("p", format(player.p.points))} songs for Paroxysm${hasMilestone("p", 5) ? `, multiplying song gain by ${format(tmp.p.effect)}` : ''}`],
                "prestige-button",
                "blank",
                "upgrades",
            ]
        },
        "Milestones": {
            content: [
                ["display-text", () => `You have created ${colored("p", format(player.p.points))} songs for Paroxysm${hasMilestone("p", 5) ? `, multiplying song gain by ${format(tmp.p.effect)}` : ''}`],
                "prestige-button",
                "blank",
                "milestones",
            ]
        },
        "Buyables": {
            unlocked() {
                return hasMilestone('p', 1) && !inChallenge('b', 12)
            },
            content:[
                ["display-text", () => `You have created ${colored("p", format(player.p.points))} songs for Paroxysm${hasMilestone("p", 5) ? `, multiplying song gain by ${format(tmp.p.effect)}` : ''}`],
                "prestige-button",
                "blank",
                "buyables",
            ]
        },
    },
    color: "#DF6079",
    requires() {
        let requires = new Decimal(5000)
            if (inChallenge('b', 12)) requires = new Decimal('10^^308')
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
        if (hasUpgrade('p', 14) && !inChallenge('b', 12)) mult = mult.div(player.points.max(10).log(10)) //div for decrease, times for increase
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1,
    displayRow: 2, // Row the layer is in on the tree (0 is the first row)
    autoPrestige() {return hasMilestone('p', 6) && !inChallenge('b', 12)},
    canBuyMax() {return hasMilestone('p', 6) && !inChallenge('b', 12)},
    resetsNothing() {return hasMilestone('p', 6) && !inChallenge('b', 12)},
    automate() {
        if (hasMilestone('p', 7) && !inChallenge('b', 12)) {
            buyBuyable('p', 11),
            buyBuyable('p', 12)
        }
    },
    hotkeys: [
        {key: "p", description: "P: Reset for Paraxysms", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasMilestone('a', 0) && !inChallenge('b', 12) || player.p.unlocked}
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
        1: {
            requirementDescription: "Chat has begun to thrive a little. (10 Messages)",
            effectDescription: "Your #general chat started to thrive a little from Halloweeb#4371 being active and listening to your songs in chat. Boost Message Gain by 10x.",
            done() {return player.m.messages.gte(10)},
        },
    },
    upgrades: {
        11: {
            title: "First Moderator",
            description: "After a lot of messages and being online and active for some time, you decided to make Halloweeb#4371 a Moderator in your server. Boost message gain by 2x, Member gain by 3x, and Album base cost is lowered by 50.",
            cost: new Decimal(50),
            currencyDisplayName: "Messages",
            currencyInternalName: "messages",
            currencyLayer: "m"
        },
        12: {
            title: "Active Chat",
            description: "More members started joining, and started to make chat alive and active. Boost note gain by ^1.2.",
            cost: new Decimal(200),
            currencyDisplayName: "Messages",
            currencyInternalName: "messages",
            currencyLayer: "m"
        },
        13: {
            title: "#shitpost channel",
            description: "You have created a shitpost channel because everyone was posting memes in #general, which was bad for your server. In exchange, your members help boost note gain based on messages.",
            cost: new Decimal(2500),
            currencyDisplayName: "Messages",
            currencyInternalName: "messages",
            currencyLayer: "m",
            effect() {
                return player[this.layer].messages.log(3).div(100).add(1)
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))}
        },
        14: {
            title: "KonekoKitten",
            description: "A youtuber by the name of KonekoKitten joined the server, and recommends you to a rhythm game. Unlock Blocks and boost song gain by ^1.1.",
            cost: new Decimal(100000),
            currencyDisplayName: "Messages",
            currencyInternalName: "messages",
            currencyLayer: "m",
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
        "Upgrades":{
            unlocked() {
                return hasMilestone('m', 1)
            },
            content: [
                ["display-text", () => "You have " + colored("m", format(player.m.points)) + " people who joined your discord."],
                "prestige-button",
                ["display-text", () => "You have " + colored("m", format(player.m.messages)) + " messages in the discord."],
                "blank",
                "upgrades",
            ],
        },
    },
    color: "#7289DA",                       
    resource: "Members",            
    row: 1,
    position: 1,                                 
    baseResource: "Songs",                 
    baseAmount() { return player.s.points },
    requires: new Decimal(5e21),              
    type: "static",                         
    exponent: 1.5, 
    update(diff)  { 
        let messageGain = new Decimal(0)
        if (hasMilestone('m', 0)) messageGain = player.m.points.div(10)
        if (hasMilestone('m', 1)) messageGain = messageGain.times(10)
        if (hasUpgrade('m', 11)) messageGain = messageGain.times(2)
        if (hasUpgrade('p', 21) && !inChallenge('b', 12)) messageGain = messageGain.times(player.p.points.div(2)).add(1)
        if (hasUpgrade('p', 22) && !inChallenge('b', 12)) messageGain = messageGain.pow(1.25)
        if (hasUpgrade('p', 23) && !inChallenge('b', 12)) messageGain = messageGain.pow(1.25)
        if (hasMilestone('b', 0)) messageGain = messageGain.times(100)
        player.m.messages = player.m.messages.add(messageGain.times(diff))
    },                    
    gainMult() {                            
        let mult = new Decimal(1) 
        if (hasUpgrade('m', 11)) mult = new Decimal(0.3)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    hotkeys: [
        {key: "m", description: "M: Reset for Members", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() { return hasUpgrade('s', 22) },
})
addLayer("b", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        total: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        time: new Decimal(0),
        ktime: new Decimal(117.6),
    }},
    update(diff) {
        let timeGain = new Decimal(1)
        player.b.time = player.b.time.add(timeGain.times(diff))
        if (inChallenge('b', 12)) {
            if (player.b.time>117.6) {
                alert("666 HA5 C0N5UM3D Y0U. Y0U F377 !N10 1H3 HAND5 0F KU23HA.")
                player.b.fail = 1
                player.b.activeChallenge = null
                doReset('b', true)
                player.b.time = 0
            }
        }
        let ktimeGain = new Decimal(0)
        if (inChallenge('b', 12)) ktimeGain = new Decimal(1)
        player.b.ktime = player.b.ktime.sub(ktimeGain.times(diff))
    },
    upgrades: {
        11: {
            title: "Bangin' Burst!",
            description: "Bang Bang! Bursting with energy, gain ^1.234 more notes!",
            cost: new Decimal(5)
        },
        12: {
            title: "Xeroa",
            description: "Xero Out your blocks to make note gain Xoosted by total blocks.",
            cost: new Decimal(10),
            effect() {
                return player[this.layer].total.log(2).div(100).add(1)
            },
            effectDisplay() { return "^"+format(upgradeEffect(this.layer, this.id))}
        },
    },
    milestones: {
        0: {
            requirementDescription: "A Block? What is this used for anyways... (1 Total Block)",
            effectDescription: "Message gain is boosted by 100x.",
            done() {return player.b.total.gte(1)}
        },
        1: {
            requirementDescription: "So you're saying that the blocks are currency in this world? How strange... (5 Total Blocks)",
            effectDescription: "Song gain is boosted by 100x.",
            done() {return player.b.total.gte(5)}
        },
        2: {
            requirementDescription: "I think I felt something wrong with some of the blocks, almost as if I'm being drained from them... (10 Total Blocks)",
            effectDescription: "Unlock Block Challenges.",
            done() {return player.b.total.gte(10)}
        },
        3: {
            requirementDescription: "Something else was discovered among the stars. Maybe it can help with this draining blocks. (20 Total Blocks)",
            effectDescription: "Note and Song Gain boosted by ^1.222 (Freedom Dive).",
            done() {return player.b.total.gte(20)}
        },
        9: {
            requirementDescription: "Start your SDVX Adventure. (10000 Total Blocks)",
            effectDescription: "Unlock Sound Voltex (Will possibly make you mad due to it being RNG based).",
            done() {return player.b.total.gte(10000)}
        },
    },
    challenges: {
        11: {
            name: "Unhypnotized Universe",
            challengeDescription: "A Dyscontrolled Galaxy has been discovered... Note gain has been nerfed by ^.69 because of the unstable discovery.",
            goalDescription: "Reach the end of this unstable discovery and make it stable again. Make a song with 1.000e50 notes in it.",
            canComplete: function() {return player.points.gte(1e50)},
        },
        12: {
            name: "666",
            challengeDescription: "666 H45 C022UP13D 3V32Y1H!N6. PARAXY5M5 A23 D!5ABL3D.",
            goalDescription: "W!5H UP0N 1H3 W02D5 0F R0U6H5K31CH AND R3ACH 6.666E666 N0135 B3F0R3 Y0U2 D3M!53.",
            canComplete: function() {return player.points.gte(6.666e666)},
            onEnter() {
                player.b.time = new Decimal(0)
                player.b.ktime = new Decimal(117.6)
                player.p.points = new Decimal(0)
            },
            onExit() {
                player.b.time = new Decimal(0)
                player.b.ktime = new Decimal(117.6)
                player.p.points = new Decimal(0)
            }
        },
    },
    tabFormat: {
        "Upgrades":{
            content: [
                ["display-text", () => "You have collected " + colored("b", format(player.b.points)) + " blocks"],
                "prestige-button",
                ["display-text", () => "You have collected a total of " + format(player.b.total) + " blocks"],
                "blank",
                ["display-text", () => "Time since Last Reset: " + format(player.b.time) + " s"],
                "upgrades",
            ]
        },
        "Milestones": {
            content: [
                ["display-text", () => "You have collected " + colored("b", format(player.b.points)) + " blocks"],
                "prestige-button",
                ["display-text", () => "You have collected a total of " + format(player.b.total) + " blocks"],
                "blank",
                ["display-text", () => "Time since Last Reset: " + format(player.b.time) + " s"],
                "milestones",
            ]
        },
        "Blocky Challenges": {
            unlocked() {
                return hasMilestone('b', 2)
            },
            content: [
                ["display-text", () => "You have collected " + colored("b", format(player.b.points)) + " blocks"],
                "prestige-button",
                ["display-text", () => "You have collected a total of " + format(player.b.total) + " blocks"],
                "blank",
                ["display-text", () => "Time since Last Reset: " + format(player.b.time) + " s"],
                "blank",
                ["display-text", () => "Challenges are not for the faint of heart, don't plunge into a challenge unless you have the right amount of currency and seem stuck. Music will be played for challenge entertainment :) (Note: 666 is 2 minutes long, not 666 seconds.)"],
                "challenges",
            ]
        },
        "Sound Voltex": {
            unlocked() {
                return hasMilestone('b', 9)
            },
            content: [
                ["display-text", () => "You have collected " + colored("b", format(player[this.layer].points)) + " blocks"],
                "prestige-button",
                "blank",
                ["display-text", () => "You have reached the endgame for v0.3.1. v0.3.2 is being worked on."],
            ],
        },
    },
   
    color: "#F7CBE0",                       // The color for this layer, which affects many elements.
    resource: "blocks",            // The name of this layer's main prestige resource.
    row: 1,  
    position: 2,                               // The row this layer is on (0 is the first row).
    baseResource: "messages",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.m.messages },  // A function to return the current amount of baseResource.
    requires: new Decimal(100000),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.
    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    hotkeys: [
        {key: "b", description: "B: Reset for Blocks", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    onPrestige() {
        player.m.messages = new Decimal(1)
        player.b.time = new Decimal(0)
    },
    layerShown() { return hasUpgrade('m', 14) },          // Returns a bool for if this layer's node should be visible in the tree.
})