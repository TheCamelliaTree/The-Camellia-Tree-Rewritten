addLayer("sc", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    symbol: "SC",
    color: "#FF0013",
    resource: "Spell Cards",
    row: 0,
    baseResource: "Mana Points",
    baseAmount() { return player.points },
    requires: new Decimal(10),
    type: "normal",
    exponent: 0.5,
    gainMult() {      
        let mult = new Decimal(1)
        if (hasMilestone('bob', 0)) mult = mult.times(2)
        if (hasUpgrade('sc', 21)) mult = mult.times(upgradeEffect('sc', 21))
        if (hasUpgrade('sc', 14)) mult = mult.times(4.444)                      
        if (hasUpgrade('sc', 41)) mult = mult.times(upgradeEffect('sc', 41))   
        return mult             
    },
    gainExp() {
        let exp = new Decimal(1)
        if (hasUpgrade('sc', 31)) exp = exp.plus(0.1)
        return exp
    },
    passiveGeneration() { let passive = 0
        if (hasMilestone('bob', 1)) passive = 0.01
        if (hasMilestone('fs', 0)) passive = 0.05
        if (hasMilestone('fs', 1)) passive = 0.10
        return passive
    },
    layerShown() { return true },
    upgrades: {
        11: {
            title: "The beginning of Gensokyo",
            description: "Start gaining 1 MP/s.",
            cost: new Decimal(1)
        },
        12: {
            title: "Fantasy Seal",
            description: "Double MP Gain.",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade('sc', 11) || hasMilestone('bob', 0)},
        },
        13: {
            title: "Master Spark",
            description: "Boost MP Gain based on Spell Cards. Formula: (log5(SC)+1)",
            cost: new Decimal(2),
            effect() { 
                let effect = player.sc.points.max(1).log(5).plus(1)
                if (hasUpgrade('sc', 22)) effect = player.sc.points.max(1).log(4).plus(1)
                return effect},
            effectDisplay() {return "Boosting MP gain by " + format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() {return hasUpgrade('sc', 11) || hasMilestone('bob', 0)},
        },
        21: {
            title: "Moonlight Ray",
            description: "Boost Spell Card Gain based on MP (just like every magic game lol)",
            cost: new Decimal(5),
            effect() { return player.points.max(1).log(10).plus(1)},
            effectDisplay() {return "Boosting Spell Card Gain by " + format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() {return hasUpgrade('sc', 11) || hasMilestone('bob', 0)},
        },
        22: {
            title: "Perfect Freeze",
            description: "Master Spark's formula is a little better (log4(SC)+1).",
            cost: new Decimal(9),
            unlocked() {return hasUpgrade('sc', 11) || hasMilestone('bob', 0)},
        },
        23: {
            title: "Colorful Rain",
            description: "MP boosts its own gain (log10(MP)+1).",
            cost: new Decimal(15),
            unlocked() {return hasUpgrade('sc', 11) || hasMilestone('bob', 0)},
            effect() { let effect = player.points.max(1).log(10).plus(1)
                if (hasUpgrade('sc', 33)) effect = player.points.max(1).log(9).plus(1) 
                return effect},
            effectDisplay() { return "Boosting MP Gain by " + format(upgradeEffect(this.layer, this.id)) + "x"},
        },
        31: {
            title: "Akiba Summer",
            description: "Spell Cards gain exp is increased by 0.1.",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade('sc', 11) || hasMilestone('bob', 0)},
        },
        32: {
            title: "The World",
            description: "Raise MP Gain ^1.1.",
            cost: new Decimal(175),
            unlocked() {return hasUpgrade('sc', 11) || hasMilestone('bob', 0)},
        },
        33: {
            title: "Scarlet Gensokyo",
            description: "Unlock a new layer and the log10 in Colorful Rain formula is now a log9.",
            cost: new Decimal(555),
            unlocked() {return hasUpgrade('sc', 11) || hasMilestone('bob', 0)},
        },
        14: {
            title: "Four of a Kind",
            description: "Multiply MP and SC gain by 4.444x.",
            cost: new Decimal(4444),
            unlocked() {return hasMilestone('fs', 2)},
        },
        24: {
            title: "Undulation Ray",
            description: "Add 1 to base MP gain.",
            cost: new Decimal(10000),
            unlocked() {return hasMilestone('fs', 2)},
        },
        34: {
            title: "Shikai Immortality",
            description: "Fantasy Seals^2 multiply MP gain.",
            cost: new Decimal(111111),
            effect() {return player.fs.points.pow(2)},
            effectDisplay() { return "Boosting MP Gain by " + format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() {return hasMilestone('fs', 2)},
        },
        41: {
            title: "Marionette Parrar",
            description: "Shikai Immortality also affects SC gain at a reduced rate.",
            cost: new Decimal(222222),
            effect() {return upgradeEffect('sc', 34).pow(0.25)},
            effectDisplay() { return "Boosting SC gain at a reduced rate of " + format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() {return hasMilestone('fs', 2)},
        },
        42: {
            title: "Stradivarius",
            description: "MP Gain is raised ^1.1.",
            cost: new Decimal(1333333),
        },
    },
    softcap: new Decimal(100000),
    softcapPower: new Decimal(0.5),
    hotkeys: [
        {
            key: "s",
            description: "S: Create a Spell Card.",
            onPress() {if (player.sc.unlocked) doReset("sc")}
        }
    ],
    doReset(resettingLayer) {
        if (layers[resettingLayer].row <= layers[this.layer].row) return;
      
        let keep = [];
        if (hasMilestone('fs', 2)) keep.push("upgrades");
        layerDataReset(this.layer, keep);
      },
          })          // Returns a bool for if this layer's node should be visible in the tree.
addLayer("bob", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
    unlocked: false,                     // You can add more variables here to add them to your layer.
    points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    symbol: "B",
    color: "#F0F0F0",                       // The color for this layer, which affects many elements.
    resource: "Battle of Bullets",            // The name of this layer's main prestige resource.
    row: 1,                                 // The row this layer is on (0 is the first row).
    baseResource: "Spell Cards",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.sc.points },  // A function to return the current amount of baseResource.    
    requires: new Decimal(750),              // The amount of the base needed to  gain 1 of the prestige currency.
    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 6,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {      
    let mult = new Decimal(1)
    return mult               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {
    let exp = new Decimal(1)
    return exp
    },    
    layerShown() { return hasUpgrade('sc', 33) || player.bob.unlocked },
    milestones: {
        0: {
            requirementDescription: "The First Battle of Bullets, I wonder how this will go. (1 Battle of Bullets)",
            effectDescription: "You gain 1 base MP/s regardless if you have the first upgrade or not, and you gain 2x as much spell cards.",
            done() { return player.bob.points.gte(1)}
        },
        1: {
            requirementDescription: "The Second Battle of Bullets, you're gaining experience. (2 Battle of Bullets)",
            effectDescription: "Gain 1% of your Spell Card gain and unlock a new layer.",
            done() { return player.bob.points.gte(2)}
        },
    },
    tabFormat:{
        "Milestones": {
            content: [
                ["display-text", () => {return `You have started ${colored("bob", format(player.bob.points))} BATTLE OF BULLETS.`}],
                "blank",
                "prestige-button",
                "blank",
                ["display-text", function() {return `You have started a total of ${format(player.bob.total)} Battle of Bullets.`}],
                "milestones",
            ],
        },
    },
    hotkeys: [
        {
            key: "b",
            description: "B: Start of Battle of Bullets.",
            onPress() {if (player.sc.unlocked) doReset("bob")}
        }
    ],
    })
    addLayer("fs", {
        startData() { return {                  // startData is a function that returns default data for a layer. 
            unlocked: false,                     // You can add more variables here to add them to your layer.
            points: new Decimal(0),
            yypoints: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
        }},
        symbol: "FS",
        color: "#FF2244",                       // The color for this layer, which affects many elements.
        resource: "Fantasy Seals",            // The name of this layer's main prestige resource.
        row: 1,                                 // The row this layer is on (0 is the first row).
        baseResource: "Mana Points",                 // The name of the resource your prestige gain is based on.
        baseAmount() { return player.points },  // A function to return the current amount of baseResource.
        requires: new Decimal(2221),              // The amount of the base needed to  gain 1 of the prestige currency.
                                                // Also the amount required to unlock the layer.
        type: "static",                         // Determines the formula used for calculating prestige currency.
        exponent: 3,                          // "normal" prestige gain is (currency^exponent).
        gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
            return new Decimal(1)               // Factor in any bonuses multiplying gain here.
        },
        gainExp() {                             // Returns the exponent to your gain of the prestige resource.
            return new Decimal(1)
        },
        layerShown() { return player.bob.points.gte(2) || player.fs.unlocked },
        tabFormat:{
            "Milestones": {
                content: [
                    ["display-text", () => {return `You have created ${colored("fs", format(player.bob.points))} Fantasy Seals.`}],
                    "blank",
                    "prestige-button",
                    "blank",
                    ["display-text", function() {return `You have created a total of ${format(player.fs.total)} Fastasy Seals.`}],
                    "blank",
                    ["display-text", function() {return hasMilestone('fs', 2) ?`You have ${colored("fs", format(player.fs.yypoints))} YinYang, which boosts MP gain by ${(colored("fs", format(player.fs.yypoints.max(1).log(10).plus(1))))}.` : ``}],
                    "milestones",
                ],
            },
            "Fantasy Seal Upgrades": {
                content: [
                    ["display-text", () => {return `You have created ${colored("fs", format(player.bob.points))} Fantasy Seals.`}],
                    "blank",
                    "prestige-button",
                    "blank",
                    ["display-text", function() {return `You have created a total of ${format(player.fs.total)} Fastasy Seals.`}],
                    "blank",
                    ["display-text", function() {return hasMilestone('fs', 2) ?`You have ${colored("fs", format(player.fs.yypoints))} YinYang, which boosts MP gain by ${(colored("fs", format(player.fs.yypoints.max(1).log(10).plus(1))))}.` : ``}],
                    "upgrades"
                ]
            }
        },          // Returns a bool for if this layer's node should be visible in the tree.
        milestones: {
            0: {
                requirementDescription: "Your first Fantasy Seal, except it's weak. (1 Fantasy Seal created)",
                effectDescription: "Gain x1.3 more MP and passive SC gain is raised to 5%.",
                done() { return player.fs.total.gte(1)}
            },
            1: {
                requirementDescription: "The 2nd Fantasy Seal, and yet you are still weak. (2 Fantasy Seals created)",
                effectDescription: "Passive SC gain is now 10%, and gain x1.5 more MP.",
                done() { return player.fs.total.gte(2)}
            },
            2: {
                requirementDescription: "3 Fantasy Seals? Nice job I guess, but not enough... (3 Fastasy Seals Created)",
                effectDescription: "Unlock Fantasy Seal Upgrades, keep all previous upgrades, start gaining YinYang, and unlock 7 more upgrades in the Spell Card layer.",
                done() { return player.fs.total.gte(3)}
            },
        },
        upgrades: {
            11: {
                title: "Dream Seal",
                description: "YinYang Gain is 2x more.",
                cost: new Decimal(10),
                currencyDisplayName: "YinYang",
                currencyInternalName: "yypoints",
                currencyLayer: "fs"
            }
        },
        hotkeys: [
            {
                key: "f",
                description: "F: Create a Fantasy Seal",
                onPress() { if (player.fs.unlocked) doReset("fs")}
            }
        ],
        update(diff) {
            let yyGain = new Decimal(0)
            if (hasMilestone('fs', 2)) yyGain = new Decimal(1)
            if (hasUpgrade('fs', 11)) yyGain = yyGain.times(2)
            player.fs.yypoints = player.fs.yypoints.plus(yyGain.times(diff))
        }
    })