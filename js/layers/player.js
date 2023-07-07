
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
    symbol: () => "🎩",
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
                if (hasUpgrade("player", 51)) eff = Decimal.add(eff, upgradeEffect("player", 22));
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
                eff = Decimal.div(eff, 250).add(1);
                if (hasUpgrade("player", 52)) eff = eff.pow(Decimal.min(upgradeEffect("player", 32), 2));
                return eff;
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
                if (hasUpgrade("player", 43)) eff = eff.mul(upgradeEffect("player", 43));
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
                let time = player.tracks.masterTime;
                if (hasUpgrade("player", 44)) time = Decimal.add(time, upgradeEffect("player", 44));
                let eff = Decimal.add(time, 1).log10().pow_base(player.tracks.masterTime);
                if (hasUpgrade("player", 34)) eff = eff.pow(upgradeEffect("player", 34));
                return eff;
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(1e10),
        },
        25: {
            ...playerExpUpgrade,
            title: "Overdrive II",
            description: "1.5× releasing song quality.",
            cost: new Decimal(1e20),
        },
        31: {
            ...playerExpUpgrade,
            title: "Think III",
            description: "Add seconds to <b>Learn</b>'s time based on the song's quality.",
            effect() {
                let quality = tmp.tracks.effect.quality;
                if (hasChallenge("world", "c-1x-2")) quality = Decimal.add(quality, 1000);
                let eff = new Decimal(quality);
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
                let time = player.tracks.expandTime;
                if (hasChallenge("world", "c-2x0")) time += 600;
                let eff = Decimal.add(time, 1).ln().div(3).min(3);
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
                let time = player.tracks.idleTime;
                if (hasChallenge("world", "c-2x0")) time += 600;
                let eff = Decimal.add(time, 10).log(10).sqrt();
                return eff;
            },
            effectDisplay() { return "^" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(1e9),
        },
        34: {
            ...playerExpUpgrade,
            title: "Master III",
            description: "Master II's effect is boosted based on the song's quality.",
            effect() {
                let quality = tmp.tracks.effect.quality;
                if (hasChallenge("world", "c-1x-2")) quality = Decimal.add(quality, 1000);
                let eff = Decimal.add(quality, 10).log(10);
                return eff;
            },
            effectDisplay() { return "^" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(1e17),
        },
        35: {
            ...playerExpUpgrade,
            title: "Overdrive III",
            description: "Unlock the ability to perform track expansions using song quality.",
            cost: new Decimal(1e50),
        },
        41: {
            ...playerExpUpgrade,
            title: "Think IV",
            description: "<b>Think III</b>'s operation is multiplication instead of addition.",
            cost: new Decimal(1e12),
        },
        42: {
            ...playerExpUpgrade,
            title: "Learn IV",
            description: "Add <b>Release</b>'s song quality to the experience gain formula.",
            cost: new Decimal(1e14),
        },
        43: {
            ...playerExpUpgrade,
            title: "Adapt IV",
            description: "Mutliply <b>Adapt</b>'s based on experience (after <b>Adapt III</b>).",
            effect() {
                let eff = Decimal.add(player.player.exp, 1).log10().sqrt().pow_base(10);
                return eff;
            },
            effectDisplay() { return "×" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(1e34),
        },
        44: {
            ...playerExpUpgrade,
            title: "Master IV",
            description: "Add seconds to <b>Master II</b>'s effect based on experience.",
            effect() {
                let eff = Decimal.add(player.player.exp, 10).log10().pow(3);
                return eff;
            },
            effectDisplay() { return "+" + format(tmp[this.layer].upgrades[this.id].effect) },
            cost: new Decimal(1e40),
        },
        51: {
            ...playerExpUpgrade,
            title: "Think V",
            description: "Apply <b>Learn II</b>'s effect to <b>Think</b>.",
            cost: new Decimal(1e24),
        },
        52: {
            ...playerExpUpgrade,
            title: "Learn V",
            description: "Apply <b>Learn III</b>'s effect to <b>Learn</b> (up to ^2).",
            cost: new Decimal(1e28),
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
            effectDescription: "Unlock a funding upgrade.",
            done() { return player.player.totalStreams.gte(1000) }
        },
        2: {
            requirementDescription: "2,000 streams",
            effectDescription: "Multiplies the note mastering multiplier by the factorial of the number of CPU upgrades.",
            done() { return player.player.totalStreams.gte(2000) }
        },
        3: {
            requirementDescription: "5,000 streams",
            effectDescription: "Unlock the ability to gain fans. Fans boosts your songs' starting publicity, among other things.",
            done() { return player.player.totalStreams.gte(5000) }
        },
        4: {
            requirementDescription: "10,000 streams",
            effectDescription: "Unlock a funding upgrade.",
            done() { return player.player.totalStreams.gte(10000) }
        },
        5: {
            requirementDescription: "20,000 streams",
            effectDescription: "Mastering tracks reduces the the mastering timer by 50% instead of resetting it to 0.",
            done() { return player.player.totalStreams.gte(20000) }
        },
        6: {
            requirementDescription: "50,000 streams",
            effectDescription() { return "Passively gain fans based on total released songs' quality. (Currently: +" + format(this.effect()) + "/hr)" },
            effect() { return Decimal.pow(player.world.totalQuality, 0.4) },
            done() { return player.player.totalStreams.gte(50000) }
        },
        7: {
            requirementDescription: "100,000 streams",
            effectDescription() { return "Unlock the ability to scrap movie clips and upgrade them." },
            effect() { return Decimal.pow(player.world.totalQuality, 0.4) },
            done() { return player.player.totalStreams.gte(100000) }
        },
        8: {
            requirementDescription: "200,000 streams",
            effectDescription() { return "Unlock a funding upgrade." },
            effect() { return Decimal.pow(player.world.totalQuality, 0.4) },
            done() { return player.player.totalStreams.gte(200000) }
        },
    },

    buyables: {
        11: {
            cost(x) {
                return Decimal.max(
                    Decimal.add(x, 1).mul(2),
                    Decimal.pow(2, x)
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
        13: {
            cost(x) {
                return Decimal.add(1, x).factorial().mul(100);
            },
            effect(x) {
                return x;
            },
            display() {
                let amt = getBuyableAmount("player", 13);
                let eff = buyableEffect("player", 13);
                let cost = this.cost();
                return `<h3>Upgrade GPU ×${formatWhole(amt)}</h3>

                    Upgrade your GPU in order to use the cheapest video making program available. Further upgrades increase the amount of video slots that you can use.

                    Currently: ${formatWhole(amt)} video slots available.

                    Costs ¥${formatWhole(cost)} money
                `
            },
            unlocked() { 
                return hasMilestone("player", 4);
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
        21: {
            cost(x) {
                return Decimal.add(1, x).factorial().mul(100);
            },
            effect(x) {
                return Decimal.pow(player.player.fans, 0.8).mul(Decimal.max(x, 1));
            },
            display() {
                let amt = getBuyableAmount("player", 21);
                let eff = buyableEffect("player", 21);
                let cost = this.cost();
                return `<h3>Sell merchandise ×${formatWhole(amt)}</h3>

                    Sell merchandise to fans, which nets you passive money based on your fan amount.

                    Currently: +¥${formatWhole(eff)}/hr.

                    Costs ¥${formatWhole(cost)} money
                `
            },
            unlocked() { 
                return hasMilestone("player", 8);
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
        fans: new Decimal(0),
        money: new Decimal(0),
    }},

    update(delta) {
        if (hasMilestone("player", 6)) {
            player.player.fans = Decimal.mul(tmp.player.milestones[6].effect, delta / 3600).add(player.player.fans);
        }
        if (Decimal.gt(getBuyableAmount("player", 21), 0)) {
            player.player.money = Decimal.mul(buyableEffect("player", 21), delta / 3600).add(player.player.money);
        }
    },

    microtabs: {
        main: {
            exp: {
                title: "Expertise",
                unlocked: () => hasAchievement("journal", "2x4"),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => `You have ${colored("player", formatWhole(player.player.exp))} experience`],
                    ["blank", "10px"],
                    ["upgrades", [1, 2, 3, 4, 5]],
                ],
            },
            views: {
                title: "Visibility",
                unlocked: () => hasAchievement("journal", "2x4"),
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => hasMilestone("player", 3) ? `You have ${colored("player", formatWhole(player.player.fans))} fans, which increase your songs' base publicity by their own amount.` : null],
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
                    ["buyables", [1, 2]],
                ],
            }
        },
    },
    
    tabFormat: [
        ["microtabs", "main"],
    ],
})