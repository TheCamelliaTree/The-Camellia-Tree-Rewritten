addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,
        points: new Decimal(0),
        trina: new Decimal(0),  
        bpm: bpmIncremental(),                   // You can add more variables here to add them to your layer.
    }},
    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "Beat Points",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.                                        // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    tabFormat: {
        "Upgrades":{
            content: [
                "prestige-button",
                "blank",
                ["display-text", () => "You have " + colored("a", format(player.a.points)) + " Beat Points"],
                "blank",
                "upgrades",
            ]
        },
    },
    upgrades: {
        11: {
            title: "BPM = BPM + 1",
            description: "The BPM is rapidly esacalating... Generate points based on the current song BPM.",
            cost: new Decimal(1),
            onPurchase() {bpmIncremental()},
            effect() {return player.a.bpm},
        },
    },
    update(diff) {
        let trinaGain = new Decimal(0)
        if (hasUpgrade('a', 11)) trinaGain = new Decimal(1)
        player.a.trina = player.a.trina.add(trinaGain.times(diff))
        if (player.a.trina.gte(137.83)) player.a.trina = new Decimal(0)
    }
})
function bpmIncremental() {
    let BPM = 100;
    function print_and_increment() {
    setTimeout(bpmIncremental, 2500)
    BPM += 1;  
    console.log(BPM);
      if (BPM <= 300) setTimeout(print_and_increment, (60_000 / BPM) * 2);
    }
    print_and_increment();
  }