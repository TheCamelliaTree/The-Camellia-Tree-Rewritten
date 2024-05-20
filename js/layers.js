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

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
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
            cost: new Decimal(1)
        },
        13: {
            title: "Master Spark",
            description: "Boost MP Gain based on Spell Cards",
            cost: new Decimal(2),
            effect() { return player.sc.points.pow(0.5).plus(1)},
            effectDisplay() {return "Boosting MP gain by " + format(upgradeEffect(this.layer, this.id)) + "x"} 
        }
    },
    hotkeys: [
        {
            key: "s",
            description: "S: Create a Spell Card.",
            onPress() {if (player.sc.unlocked) doReset("sc")}
        }
    ]
          })          // Returns a bool for if this layer's node should be visible in the tree.