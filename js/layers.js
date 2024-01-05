addLayer("afk", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        t: new Decimal(0),
        m: new Decimal(1),
        b: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
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
        let statnames = ["t", "m", "b"] // put more stats here
        for (i in statnames) {
          if (i === statnames.length-1) break
          if (player.afk[statnames[i]].gte(new Decimal(100).mul(new Decimal(1.15).pow(i)))) {
            player.afk[statnames[i]] = new Decimal(0)
            player.afk[statnames[i+1]] = player.afk[statnames[i+1]].add(1)
          }
          player.afk[statnames[i]] = player.afk[statnames[i]].add(player.afk[statnames[i+1]].times(0.1)).times(diff/1000)
        }},
    tabFormat: {
        "Stats": {
            content: [
                "main-display",
        ["display-text", () => "You have " + format(player.afk.t) + " points."],
        ["display-text", () => "You have " + format(player.afk.m) + " multi."],
        ["display-text", () => "Your BPM is currently " + format(player.afk.b) + " BPM."],
            ]
        }
}
})