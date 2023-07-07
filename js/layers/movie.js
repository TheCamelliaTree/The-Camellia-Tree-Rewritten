
function getClipQuality(tier) {
    return Decimal.pow(tier, 2).mul(25).add(75);
}
function getClipScrapValue(tier) {
    return Decimal.pow(tier, 2).mul(50).add(50);
}
function getClipUpgradeCost(tier) {
    return Decimal.pow(tier, 3).mul(50).add(200);
}

function moveClip(pos, from, to) {
    if (player.movie.actionMode == "move") {
        if (to == player.movie.activeClips && to.length >= tmp.movie.effect.limit) return;
        to.push(...from.splice(pos, 1));
    } else if (player.movie.actionMode == "scrap") {
        player.movie.scraps = Decimal.add(player.movie.scraps, getClipScrapValue(from[pos].tier));
        from.splice(pos, 1);
    } else if (player.movie.actionMode == "upgrade") {
        let cost = getClipUpgradeCost(from[pos].tier);
        if (Decimal.lt(player.movie.scraps, cost)) return;
        player.movie.scraps = Decimal.sub(player.movie.scraps, cost);
        from[pos].tier = Decimal.add(from[pos].tier, 1);
    }
}

addLayer("movie", {
    name: "The Movie Maker",

    row: 0, 
    position: 1,
    color: "#caccd1",
    symbol: () => "🎥",

    startData() { return {
        unlocked: true,
        actionMode: "move",
        scraps: new Decimal(0),
        activeClips: [],
        inactiveClips: [],
    }},

    effect() {
        let eff = {};

        eff.baseQuality = new Decimal(0);
        eff.flows = [];
        eff.totalFlows = 0;

        let lastClip = null;

        for (let clip of player.movie.activeClips) {
            eff.baseQuality = eff.baseQuality.add(getClipQuality(clip.tier));
            eff.flows.push(0);
            if (lastClip) {
                for (let f = 0; f < clip.startFlows.length; f++) {
                    if (lastClip.endFlows[f] && clip.startFlows[f]) {
                        eff.flows[eff.flows.length - 2]++;
                        eff.flows[eff.flows.length - 1]++;
                        eff.totalFlows += 2;
                    }
                }
            } else {
                if (!clip.startFlows.includes(true)) {
                    eff.flows[eff.flows.length - 1] += 3;
                    eff.totalFlows += 3;
                }
            }
            lastClip = clip;
        }
        if (lastClip && !lastClip.endFlows.includes(true)) {
            eff.flows[eff.flows.length - 1] += 3;
            eff.totalFlows += 3;
        }

        eff.quality = eff.baseQuality.mul(eff.totalFlows * .1 + 1);

        eff.limit = new Decimal(getBuyableAmount("player", 13)).toNumber();

        return eff;
    },

    tooltip() {
        return `
            <h3>The Movie Maker</h3><br/>
            ${format(tmp.movie.effect.quality)} quality
        `
    },

    doReset(layer) {
        setBuyableAmount(this.layer, 11, new Decimal(0));
        player.movie.scraps = new Decimal(0);
        player.movie.activeClips = [];
        player.movie.inactiveClips = [];
    },

    update(delta) {
    },

    buyables: {
        11: {
            cost(x) {
                let cost = Decimal.pow(x, 2).mul(0.05).add(Decimal.mul(x, 10)).add(30).pow_base(10);
                if (hasChallenge("world", "c2x0")) cost = cost.div(Decimal.pow(2, player.tracks.songTime / 60));
                return cost;
            },
            display() {
                let amt = getBuyableAmount("player", 11);
                let cost = this.cost();
                return `<h3>Create</h3>

                    Create a movie clip.

                    Costs ${formatWhole(cost)} ideas
                `
            },
            canAfford() { 
                return Decimal.gte(player.points, this.cost());
            },
            buy() {
                player.points = Decimal.sub(player.points, this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));

                let clip = {
                    tier: new Decimal(1),
                    startFlows: new Array(3).fill().map(x => Math.random() < .5),
                    endFlows: new Array(3).fill().map(x => Math.random() < .5),
                };

                player.movie.inactiveClips.push(clip);
            },
            style: {
                width: "150px",
                height: "100px",
                "border-radius": 0,
            }
        },
    },
    
    tabFormat: [
        "movie-info",
        ["blank", "10px"],
        ["buyable", 11],
        ["column", () => hasMilestone("player", 7) ? [
            ["blank", "10px"],
            ["raw-html", `You have ${colored("movie", formatWhole(player.movie.scraps))} movie scrap.`],
            ["blank", "10px"],
            "movie-mode",
        ] : []],
        "clip-inventory",
    ],

    layerShown(){ return hasAchievement("journal", "4x1") }
})