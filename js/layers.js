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
        12: {
            title: "Looking for a detective to check on the progress.",
            description: "Double your point gain... Saturday is broke.",
            cost: new Decimal(2)
        },
        13: {
            title: "Getting no progress on the investigation.",
            description: "Gain more points, based on batteries... How is that suppose to work?",
            cost: new Decimal(3),
            effect() {
                return player.b.points.max(1).log(10).plus(1)
            },
            effectDisplay() { return "Boosting point gain by " + format(upgradeEffect(this.layer, this.id)) + "x"},
        },
        14: {
            title: "Meeting your very shy but mood swinging friend, Allison!",
            description: "Gain more Batteries based on points... hold up, is the economy inflating or deflating?",
            cost: new Decimal(5),
            effect() {
                return player.points.max(1).log(10).plus(1)
            }
        },
    },
    hotkeys: [
        {
            key: "b",
            description: "B: Get some Batteries",
            onPress() {if (player.b.unlocked) doReset("b")}
        }
    ],
          })          // Returns a bool for if this layer's node should be visible in the tree.