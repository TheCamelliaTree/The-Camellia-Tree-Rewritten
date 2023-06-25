
let playerExpUpgrade = {
    currencyDisplayName: "experience",
    currencyInternalName: "exp",
    currencyLayer: "player",
}
let playerMoneyUpgrade = {
    currencyDisplayName: "money",
    currencyInternalName: "money",
    currencyLayer: "player",
}


addLayer("player", {
    name: "cametek",

    row: 1, 
    position: 0,
    color: "#e77376",
    symbol: () => ":",
    layerShown() {
        return hasAchievement("journal", "1x4");
    },

    tooltip() {
        return `
            <h3>cametek</h3><br/>
            ${formatWhole(player.player.exp)} experience
        `
    },

    upgrades: {
        11: {
            ...playerExpUpgrade,
            title: "Think",
            description: "Gain ideas faster based on time since you last added notes.",
            effect() { 
                let eff = player.tracks.idleTime;
                if (hasUpgrade("player", 31)) eff = Decimal[hasUpgrade("player", 41) ? "mul" : "add"](eff, upgradeEffect("player", 31));
                eff = Decimal.div(eff, 5).add(1);
                if (hasUpgrade("player", 21)) eff = eff.pow(2);
                return eff;
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(95),
        },
        12: {
            ...playerExpUpgrade,
            title: "Learn",
            description: "Gain more experience based on time since you finish your last song.",
            effect() {
                let eff = new Decimal(player.tracks.songTime);
                if (hasUpgrade("player", 32)) eff = eff.pow(upgradeEffect("player", 32));
                if (hasUpgrade("player", 22)) eff = eff.add(upgradeEffect("player", 22));
                return Decimal.div(eff, 250).add(1)
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(500),
        },
        13: {
            ...playerExpUpgrade,
            title: "Adapt",
            description: "Notes are easier to add based on your unspent experience.",
            effect() { 
                let eff = Decimal.div(player.player.exp, 100).add(Math.E).ln();
                if (hasUpgrade("player", 23)) eff = eff.pow(upgradeEffect("player", 23));
                if (hasUpgrade("player", 33)) eff = eff.pow(upgradeEffect("player", 33));
                return eff;
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(3280),
        },
        14: {
            ...playerExpUpgrade,
            title: "Master",
            description: "You can now \"master\" a track, which gives you a exponential boost to a track. Resets on Expand.",
            cost: new Decimal(216000),
        },
        15: {
            ...playerExpUpgrade,
            title: "Overdrive",
            description: "1.25× song quality.",
            cost: new Decimal(1e11),
        },
        21: {
            ...playerExpUpgrade,
            title: "Think II",
            description: "<b>Think</b>'s effect is squared.",
            cost: new Decimal(7270),
        },
        22: {
            ...playerExpUpgrade,
            title: "Learn II",
            description: "Add seconds to <b>Learn</b>'s time based on the song's quality.",
            effect() {
                let eff = Decimal.pow(tmp.tracks.effect.quality, 2);
                return eff;
            },
            effectDisplay() { return "+" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(42069),
        },
        23: {
            ...playerExpUpgrade,
            title: "Adapt II",
            description: "Raise <b>Adapt</b>'s effect based on time since last expansion.",
            effect() {
                let eff = Decimal.add(player.tracks.expandTime, 1).log10();
                return eff;
            },
            effectDisplay() { return "^" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(3.69e6),
        },
        24: {
            ...playerExpUpgrade,
            title: "Master II",
            description: "Mastering gain a bonus based on the time since you last mastered a track.",
            effect() {
                let eff = Decimal.add(player.tracks.masterTime, 1).log10().pow_base(player.tracks.masterTime);
                return eff;
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(1e10),
        },
        31: {
            ...playerExpUpgrade,
            title: "Think III",
            description: "Add seconds to <b>Learn</b>'s time based on the song's quality.",
            effect() {
                let eff = new Decimal(tmp.tracks.effect.quality);
                return eff;
            },
            effectDisplay() { return "+" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(32e6),
        },
        32: {
            ...playerExpUpgrade,
            title: "Learn III",
            description: "Raise <b>Learn</b>'s base time based on time since last expansion.",
            effect() {
                let eff = Decimal.add(player.tracks.expandTime, 1).ln().div(3).min(3);
                return eff;
            },
            effectDisplay() { return "^" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(128e6),
        },
        33: {
            ...playerExpUpgrade,
            title: "Adapt III",
            description: "Raise <b>Adapt</b>'s effect based on time since you last added notes.",
            effect() {
                let eff = Decimal.add(player.tracks.idleTime, 10).log(10).sqrt();
                return eff;
            },
            effectDisplay() { return "^" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(1e9),
        },
        41: {
            ...playerExpUpgrade,
            title: "Think IV",
            description: "<b>Think III</b>'s operation is multiplication instead of addition.",
            cost: new Decimal(1e12),
        },
        42: {
            ...playerExpUpgrade,
            title: "Learn III",
            description: "Add <b>Release</b>'s song quality to the experience gain formula.",
            cost: new Decimal(1e14),
        },
    },

    milestones: {
        0: {
            requirementDescription: "500 streams",
            effectDescription: "Adding notes to tracks reduces the adding notes timer by 50% instead of resetting it to 0.",
            done() { return player.player.totalStreams.gte(500) }
        },
        1: {
            requirementDescription: "1,000 streams",
            effectDescription: "Unlock another funding upgrade.",
            done() { return player.player.totalStreams.gte(1000) }
        },
        2: {
            requirementDescription: "2,000 streams",
            effectDescription: "Multiplies the note mastering multiplier by the factorial of the number of CPU upgrades.",
            done() { return player.player.totalStreams.gte(2000) }
        },
    },

    buyables: {
        11: {
            cost(x) {
                return Decimal.max(
                    Decimal.add(x, 1).mul(2),
                    Decimal.pow(2, x),
                    Decimal.add(x, 1).factorial().div(6)
                );
            },
            display() {
                let amt = getBuyableAmount("player", 11);
                let cost = this.cost();
                return `<h3>Upgrade CPU ×${formatWhole(amt)}</h3>

                    Upgrade your CPU to be able to use automation tracks that automagically adds 100% of your notes gained on add every second.

                    Currently: ${formatWhole(amt)} automation tracks available

                    Costs ¥${formatWhole(cost)} money
                `
            },
            canAfford() { 
                return Decimal.gte(player.player.money, this.cost());
            },
            buy() {
                player.player.money = Decimal.sub(player.player.money, this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style: {
                width: "160px",
                height: "160px",
                "border-radius": 0,
            }
        },
        12: {
            cost(x) {
                return Decimal.pow(1.2, x).mul(10);
            },
            effect(x) {
                return Decimal.pow(2, x);
            },
            display() {
                let amt = getBuyableAmount("player", 12);
                let eff = buyableEffect("player", 12);
                let cost = this.cost();
                return `<h3>Buy books ×${formatWhole(amt)}</h3>

                    Buy and study music theory books to multiply your experience gain by 2×.

                    Currently: ×${formatWhole(eff)} experience gain

                    Costs ¥${formatWhole(cost)} money
                `
            },
            unlocked() { 
                return hasMilestone("player", 1);
            },
            canAfford() { 
                return Decimal.gte(player.player.money, this.cost());
            },
            buy() {
                player.player.money = Decimal.sub(player.player.money, this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style: {
                width: "160px",
                height: "160px",
                "border-radius": 0,
            }
        },
    },

    startData() { return {
        unlocked: true,
        exp: new Decimal(0),
        totalStreams: new Decimal(0),
        money: new Decimal(0),
    }},

    microtabs: {
        main: {
            exp: {
                title: "Expertise",
                unlocked: () => hasAchievement("journal", "2x4"),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have ${colored("player", formatWhole(player.player.exp))} experience`],
                    ["blank", "10px"],
                    ["upgrades", [1, 2, 3, 4]],
                ],
            },
            views: {
                title: "Visibility",
                unlocked: () => hasAchievement("journal", "2x4"),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `Your songs have been streamed for a total of ${colored("player", formatWhole(player.player.totalStreams))} times.`],
                    ["blank", "10px"],
                    "milestones",
                ],
            },
            money: {
                title: "Funding",
                unlocked: () => hasAchievement("journal", "2x4"),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `Your wallet is containing ${colored("player", "¥" + formatWhole(player.player.money))}.`],
                    ["blank", "10px"],
                    ["buyables", [1]],
                ],
            }
        },
    },
    
    tabFormat: [
        ["microtabs", "main"],
    ],
})