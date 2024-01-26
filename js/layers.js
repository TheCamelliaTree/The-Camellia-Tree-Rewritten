addLayer("p", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        ii: 0,             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "prestige points",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).

    baseResource: "points",                 // The name of the resource your prestige gain is based on.
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

    layerShown() { return !inChallenge('p', 11) ? false : true},          // Returns a bool for if this layer's node should be visible in the tree.
    effect() {
        let eff = {};
        let chal = layers.p.challenges[player.p.activeChallenge];
        if (chal?.timeLimit) {
            eff.timeLimit = true;
            eff.timeLeft = chal.timeLimit - player.p.ii;
        }
        else {
            eff.timeLeft = tmp.p.effect?.timeLeft ?? 0;
        }
    return eff},

    challenges: {
        11: {
            name: "͟͝͞Ⅱ́̕",
            challengeDescription: "YOU CAN'T ESCAPE IT.",
            goalDescription: "THERE IS NO TURNING BACK. ARE YOU SURE YOU WANT TO CLICK?",
            canComplete: function() {return player.points.gte(1e50)},
            timeLimit: 445
        },
    },
})
