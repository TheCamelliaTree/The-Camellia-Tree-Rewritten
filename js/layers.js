addLayer("sc", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    symbol: "SC",
    color: "#FF0013",                       // The color for this layer, which affects many elements.
    resource: "Spell Cards",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "Mana Points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {      
        let mult = new Decimal(1)
        if (hasUpgrade('sc', 21)) mult = mult.times(upgradeEffect('sc', 21))                      // Returns your multiplier to your gain of the prestige resource.
        return mult               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {
        let exp = new Decimal(1)
        if (hasUpgrade('sc', 31)) exp = exp.times(upgradeEffect('sc', 31))                             // Returns the exponent to your gain of the prestige resource.
        return exp
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
            unlocked() {return hasUpgrade('sc', 11)}
        },
        13: {
            title: "Master Spark",
            description: "Boost MP Gain based on Spell Cards. Formula: (sqrt(SC)+1)",
            cost: new Decimal(2),
            effect() { 
                let effect = player.sc.points.pow(0.5).plus(1)
                if (hasUpgrade('sc', 22)) effect = player.sc.points.pow(0.65).plus(1)
                return effect},
            effectDisplay() {return "Boosting MP gain by " + format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() {return hasUpgrade('sc', 11)}
        },
        21: {
            title: "Moonlight Ray",
            description: "Boost Spell Card Gain based on MP (just like every magic game lol)",
            cost: new Decimal(5),
            effect() { return player.points.pow(0.1).plus(1)},
            effectDisplay() {return "Boosting Spell Card Gain by " + format(upgradeEffect(this.layer, this.id)) + "x"},
            unlocked() {return hasUpgrade('sc', 11)}
        },
        22: {
            title: "Perfect Freeze",
            description: "Master Spark's formula is a little better ((SC^0.65)+1).",
            cost: new Decimal(9),
            unlocked() {return hasUpgrade('sc', 11)}
        },
        23: {
            title: "Colorful Rain",
            description: "MP boosts its own gain.",
            cost: new Decimal(15),
            unlocked() {return hasUpgrade('sc', 11)},
            effect() { return player.points.max(1).log(10).plus(1)},
            effectDisplay() { return "Boosting MP Gain by " + format(upgradeEffect(this.layer, this.id)) + "x"},
        },
        31: {
            title: "Akiba Summer",
            description: "Spell Cards boosts its own gain log_10000(SC)+1.",
            cost: new Decimal(100),
            unlocked() {return hasUpgrade('sc', 11)},
            effect() { let effect = player.sc.points.max(1).log(10000).plus(1)
                let eTS = effect
                if (eTS.gte(1.5)) effect = new Decimal(1.5).pow(effect.div(1.5)).log(10).pow(0.6).times(4)
                return effect},
            effectDisplay() { let display = "Boosting Spell Card Gain by ^" + format(upgradeEffect(this.layer, this.id)) + " (softcapped at ^1.5)"
                return display
            }
        },
    },
    hotkeys: [
        {
            key: "s",
            description: "S: Create a Spell Card.",
            onPress() {if (player.sc.unlocked) doReset("sc")}
        }
    ]
          })          // Returns a bool for if this layer's node should be visible in the tree.