addLayer("b", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        ii4: new Decimal(0),
        ii3: new Decimal(0),
                     // "points" is the internal name for the main resource of the layer.
    }},

    color: "#DAC123",                       // The color for this layer, which affects many elements.
    resource: "???",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).
    symbol: "666",
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

    layerShown() { return !inChallenge('b', 11) && !inChallenge('p', 11)? true : false},          // Returns a bool for if this layer's node should be visible in the tree.
    effect() {
        let eff = {};
        let chal = layers.b.challenges[player.b.activeChallenge];
        if (chal?.timeLimit4) {
            eff.timeLimit4 = true;
            eff.timeLeft4 = chal.timeLimit4 - player.b.ii4;
        }
        else {
            eff.timeLeft4 = tmp.b.effect?.timeLeft4 ?? 0;
        }
        if (chal?.timeLimit3) {
            eff.timeLimit3 = true;
            eff.timeLeft3 = chal.timeLimit3 - player.b.ii3
        }
        else {
            eff.timeLeft3 = tmp.b.effect?.timeLeft3 ?? 0;
        }
    return eff},

    challenges: {
        11: {
            name: "͟͝666",
            challengeDescription: "666",
            goalDescription: "666",
            canComplete: function() {return player.points.gte(1e50)},
            timeLimit4: 120,
            timeLimit3: 120,
            unlocked() {
                return !inChallenge('b', 11)
            },
            onEnter() {
                player.p.ii4 = new Decimal(0)
                player.p.ii3 = new Decimal(0)
            },
            onExit() {
                player.p.ii4 = new Decimal(0)
                player.p.ii3 = new Decimal(0)
            },
        },
    },
    update(diff) {
        let ii4Gain = new Decimal(0)
        let ii3Gain = new Decimal(0)
        if (inChallenge('b', 11)) ii4Gain = new Decimal(1)
        player.b.ii4 = player.b.ii4.add(ii4Gain.times(diff))
        if (inChallenge('b', 11)) ii3Gain = new Decimal(1)
        player.b.ii3 = player.b.ii3.add(ii3Gain.times(diff))
        if (inChallenge('b', 11)) {
            if (player.b.ii4>120) {
                alert("666 HAS CONSUMED YOU.")
                player.b.fail = 1
                player.b.activeChallenge = null
                doReset('b', true)
                player.b.ii4 = 0
                player.b.ii3 = 0
            }
        }
    },
    tabFormat: {
        "666": {
            unlocked() {
                return !inChallenge('b', 11)
            },
            content: [
                "blank",
                "blank",
                "blank",
                "challenges"
            ]
        },
    },
})
addLayer("p", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),
        ii: new Decimal(0),
        ii2: new Decimal(0),
                     // "points" is the internal name for the main resource of the layer.
    }},

    color: "#D9381E",                       // The color for this layer, which affects many elements.
    resource: "???",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).
    symbol: "Ⅱ́̕",
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

    layerShown() { return !inChallenge('p', 11) && !inChallenge('b', 11) ? true : false},          // Returns a bool for if this layer's node should be visible in the tree.
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
        if (chal?.timeLimit2) {
            eff.timeLimit2 = true;
            eff.timeLeft2 = chal.timeLimit2 - player.p.ii2
        }
        else {
            eff.timeLeft2 = tmp.p.effect?.timeLeft2 ?? 0;
        }
    return eff},

    challenges: {
        11: {
            name: "͟͝͞Ⅱ́̕",
            challengeDescription: "YOU CAN'T ESCAPE IT.",
            goalDescription: "THERE IS NO TURNING BACK. ARE YOU SURE YOU WANT TO CLICK?",
            canComplete: function() {return player.points.gte(1e50)},
            timeLimit: 445,
            timeLimit2: 445,
            unlocked() {
                return !inChallenge('p', 11)
            },
            onEnter() {
                player.p.ii = new Decimal(0)
                player.p.ii2 = new Decimal(0)
            },
            onExit() {
                player.p.ii = new Decimal(0)
                player.p.ii2 = new Decimal(0)
            },
        },
    },
    update(diff) {
        let iiGain = new Decimal(0)
        let ii2Gain = new Decimal(0)
        if (inChallenge('p', 11)) iiGain = new Decimal(1)
        player.p.ii = player.p.ii.add(iiGain.times(diff))
        if (inChallenge('p', 11)) ii2Gain = new Decimal(1)
        player.p.ii2 = player.p.ii2.add(ii2Gain.times(diff))
        if (inChallenge('p', 11)) {
            if (player.p.ii>445) {
                alert("I'm sorry... Ivy...")
                player.p.fail = 1
                player.p.activeChallenge = null
                doReset('p', true)
                player.p.ii = 0
                player.p.ii2 = 0
            }
        }
    },
    tabFormat: {
        "II": {
            unlocked() {
                return !inChallenge('p', 11)
            },
            content: [
                "blank",
                "blank",
                "blank",
                "challenges"
            ]
        },
    },
})