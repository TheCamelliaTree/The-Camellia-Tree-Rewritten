addLayer("afk", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        t: new Decimal(0),
        m: new Decimal(1),
        r: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "AFK points",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "none",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.

    update(diff) {
        let treeGain = player.afk.m
        let multiGain = player.afk.r.div(10)
        if (player.afk.t.gte(100)) player.afk.t = new Decimal(0) && player.afk.m.add(1)
        if (player.afk.m.gte(125)) player.afk.m = new Decimal(0) && player.afk.r.add(1)
        player.afk.t = player.afk.t.add(treeGain.times(diff))
        player.afk.m = player.afk.m.add(multiGain.times(diff))
    },
    tabFormat: [
        "Stats":
        ["display-text", () => "You have " + player.afk.t + " points."]
        ["display-text", () => "You have " + player.afk.m + " multi."]
        ["display-text", () => "You have " + player.afk.r + " rebirths."]
    ]
})