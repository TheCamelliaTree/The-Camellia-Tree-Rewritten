addLayer("b", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    symbol: "B",
    color: "#164AD6",
    resource: "Batteries",
    row: 0,
    baseResource: "Points",
    baseAmount() { return player.points },
    requires: new Decimal(10),
    type: "normal",
    exponent: 0.5,
    gainMult() {      
        let mult = new Decimal(1)
        return mult             
    },
    gainExp() {
        let exp = new Decimal(1)
        return exp
    },
    passiveGeneration() { let passive = 0
        return passive
    },
    tabFormat: {
        "Battery Upgrades": {
            content: [
                ["display-text", () => {return `You have ${colored("b", format(player.b.points))} Batteries`}],
                "blank",
                "prestige-button",
                "blank",
                ["display-text", function() {return `You have collected a total of ${format(player.b.total)} Batteries`}],
                "blank",
                "upgrades"
            ]
        }
    },
    layerShown() { return true },
    upgrades: {
        11: {
            title: "Where did my sister run off to?",
            description: "Start Earning 1 Point/s",
            cost: new Decimal(1)
        },
    },
    hotkeys: [
        {
            key: "b",
            description: "B: Get some Batteries",
            onPress() {if (player.sc.unlocked) doReset("sc")}
        }
    ],
          })          // Returns a bool for if this layer's node should be visible in the tree.