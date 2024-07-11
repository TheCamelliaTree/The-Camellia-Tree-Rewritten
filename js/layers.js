addLayer("b", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        saturday: ''
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
        if (hasUpgrade('b', 14)) mult = mult.times(upgradeEffect('b', 14))
        return mult             
    },
    gainExp() {
        let exp = new Decimal(1)
        if (hasUpgrade('b', 21)) exp = exp.add(0.1)
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
        },
        "Something": {
            unlocked() {return hasUpgrade('b', 23)},
            content: [
                ["display-text", () => {return `Welcome to the ARG part of this layer. Hopefully you know what ARGs are so have fun trying to get the answer! (If you do find the answer, please do not share it with other players as it will ruin the fun of the ARG.)`}],
                "blank",
                "challenges",
                function() {
                    if (inChallenge('b', 11))return [
                        "text-input", 'saturday'
                    ]
                },
            ]
        }
    },
    layerShown() { return true },
    upgrades: {
        11: {
            title: "Missing Sister",
            description: "Start Earning 1 Point/s",
            cost: new Decimal(1)
        },
        12: {
            title: "Progress?",
            description: "Double your point gain... Wow, you are broke.",
            cost: new Decimal(2)
        },
        13: {
            title: "No progress, what a bummer.",
            description: "Gain more points, based on batteries... How is that suppose to work?",
            cost: new Decimal(3),
            effect() {
                return player.b.points.max(1).log(10).plus(1)
            },
            effectDisplay() { return "Boosting point gain by " + format(upgradeEffect(this.layer, this.id)) + "x"},
        },
        14: {
            title: "Meeting up with one of your friends.",
            description: "Gain more Batteries based on points... hold up, is the economy inflating or deflating?",
            cost: new Decimal(5),
            effect() {
                return player.points.max(1).log(100).plus(1)
            },
            effectDisplay() { return "Boosting Battery gain by " + format(upgradeEffect(this.layer, this.id)) + "x"}
        },
        15: {
            title: "Running into one of your other friends by chance.",
            description: "Gain more points, based on... points? Ok, did someone call for inflation or is the currency value going up?",
            cost: new Decimal(10),
            effect() {
                return player.points.max(1).log(1000).plus(1)
            },
            effectDisplay() { return "Boosting Point gain by " + format(upgradeEffect(this.layer, this.id)) + "x"}
        },
        21: {
            title: "Checking out the Office for some clues about your sister's disappearance.",
            description: "Gain 100x points and add 0.1 to Battery Gain exp... Yay, you're not broke anymore, I guess?",
            cost: new Decimal(25),
        },
        22: {
            title: "Seeing a weird file/website on her computer called shrinereport.xyz.",
            description: "1658502732... what does that mean? (Will reset everything, but unlock a new upgrade.)",
            cost: new Decimal(1000),
            onPurchase() {
                player.points = new Decimal(10)
                player.b.points = new Decimal(0)
            }
        },
        23: {
            title: "???",
            description: "Unlock Something.",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade('b', 22)}
        },
    },
    challenges: {
        11: {
        name: "???",
        challengeDescription: "Find the answers within all my other trees.",
        canComplete() {return true ? player.b.saturday === "VIVIDWAVE" : false}
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