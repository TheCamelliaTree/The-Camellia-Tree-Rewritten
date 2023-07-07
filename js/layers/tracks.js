
function canAddNotesToTrack(id) {
    if (player.tracks.actionMode == "add") {
        if (id != 0 && Decimal.lte(player.tracks.notes[0], 0)) return false;
        if (tmp.tracks.effect.autoLimit > +id) return false;
    } else if (player.tracks.actionMode == "master") {
        if (Decimal.lte(tmp.tracks.effect.masterGain?.[id] || 0, player.tracks.masters[id])) return false;
    }
    return true;
}

function addNotesToTrack(id) {
    if (!canAddNotesToTrack(id)) return;
    if (player.tracks.actionMode == "add") {
        player.tracks.notes[id] = Decimal.mul(player.points, tmp.tracks.effect.trackGain[id] ?? 1).floor().add(player.tracks.notes[id]);
        player.points = new Decimal(0);
        player.tracks.idleTime = hasMilestone("player", 0) ? player.tracks.idleTime / 2 : 0;
    } else if (player.tracks.actionMode == "master") {
        player.tracks.masters[id] = tmp.tracks.effect.masterGain[id];
        player.tracks.masterTime = hasMilestone("player", 5) ? player.tracks.masterTime / 2 : 0;
        trackReseterReset();
    }
}

function trackReseterReset() {
    player.points = new Decimal(1);
    player.tracks.notes = [];
    player.tracks.extraMulti = [];
    player.tracks.idleTime = 0;
}

function setTrackMode(mode) {
    player.tracks.actionMode = mode;
}

addLayer("tracks", {
    name: "The Tracker",

    row: 0, 
    position: 0,
    color: "#c0c3e1",
    symbol: () => "🎼",

    startData() { return {
        unlocked: true,
        fullView: false,
        notes: [],
        masters: [],
        extraMulti: [],
        idleTime: 0,
        masterTime: 0,
        expandTime: 0,
        songTime: 0,
        actionMode: "add",
    }},

    effect() {
        let eff = {};

        eff.limit = 1 + new Decimal(getBuyableAmount("tracks", "r1")).toNumber();
        if (hasChallenge("world", "c0x0")) {
            let time = 300;
            if (hasChallenge("world", "c1x-2")) time -= 60;
            if (player.tracks.songTime >= time) eff.limit += 1;
        }

        eff.autoLimit = new Decimal(getBuyableAmount("player", 11)).toNumber();
        if (inChallenge("world", "_noauto")) eff.autoLimit = 0;
        else if (inChallenge("world", "_snail")) eff.autoLimit = Infinity;

        eff.noteBoost = new Decimal(1);
        if (hasUpgrade("player", 13)) eff.noteBoost = eff.noteBoost.mul(upgradeEffect("player", 13));
        if (hasChallenge("world", "c-1x-1") && player.tracks.expandTime < 11) eff.noteBoost = eff.noteBoost.mul(11);

        eff.masterBoost = new Decimal(1);
        if (hasUpgrade("player", 24)) eff.masterBoost = eff.masterBoost.mul(upgradeEffect("player", 24));
        if (hasMilestone("player", 2)) eff.masterBoost = eff.masterBoost.mul(Decimal.max(getBuyableAmount("player", 11), 1).factorial());
        
        eff.masterPow = new Decimal(1);
        if (hasChallenge("world", "c1x-1")) eff.masterPow = eff.masterPow.mul(1.11);
        
        eff.trackBase = {};
        eff.trackPower = {};
        eff.trackBoost = {};
        eff.trackGain = {};
        eff.trackCan = {};
        eff.masterGain = {};

        eff.quality = new Decimal(0);
        eff.totalNotes = new Decimal(0);
        eff.totalMasters = new Decimal(0);
        eff.totalPower = new Decimal(0);
        
        for (let a = 0; a < eff.limit; a++) {
            eff.totalNotes = eff.totalNotes.add(player.tracks.notes[a]);
            eff.totalMasters = eff.totalMasters.add(player.tracks.masters[a]);

            eff.trackBase[a] = Decimal.add(player.tracks.notes[a], 1).log(10).add(1);
            eff.trackPower[a] = Decimal.add(player.tracks.masters[a], 1).log(10).div(20).add(1).sqrt();
            
            eff.quality = eff.quality.add(eff.trackBase[a].mul(eff.trackPower[a]));
            eff.trackBoost[a] = eff.trackBase[a].add(player.tracks.extraMulti[a] ?? 0).pow(eff.trackPower[a]);
            
            eff.totalPower = eff.totalPower.add(eff.trackPower[a]);
            
            eff.masterGain[a] = Decimal.mul(player.tracks.notes[a], eff.masterBoost).pow(eff.masterPow);

            eff.trackCan[a] = canAddNotesToTrack(a);
        }
        eff.trackBoost[0] = eff.trackBoost[0].sub(1);

        for (let a = eff.limit - 2; a >= 0; a--) {
            eff.trackBoost[a] = Decimal.mul(eff.trackBoost[a], eff.trackBoost[a + 1]);
        }
        for (let a = 0; a < eff.limit; a++) {
            eff.trackGain[a] = eff.noteBoost;
            if (a >= 1) eff.trackGain[a - 1] = eff.trackGain[a - 1].mul(eff.trackBoost[a]);
        }

        if (hasUpgrade("player", 15)) eff.quality = eff.quality.mul(1.25);
        if (inChallenge("world", "_decay2")) eff.quality = eff.quality.sub(100 * player.tracks.expandTime / 60).max(0);


        return eff;
    },

    tooltip() {
        return `
            <h3>The Tracker</h3><br/>
            ${format(tmp.tracks.effect.quality)} quality
        `
    },

    doReset(layer) {
        trackReseterReset();
        player.tracks.masters = [];
        setBuyableAmount(this.layer, "r1", new Decimal(0));
        player.tracks.expandTime = 0;
        player.tracks.songTime = 0;
        player.tracks.masterTime = 0;

        layers.movie.doReset();
    },

    clickables: {
        "f1": {
            display() {
                let amt = getBuyableAmount("tracks", "r1");
                let temp = tmp[this.layer].clickables[this.id];
                return `<h3>Finish</h3> 

                    Close the song, and never touch it again. (Unless, you want to continue on, with a twist.)

                    ${temp.canClick ? 
                   `Gain
                    ${formatWhole(temp.effect)} experience` : 
                   `Requires at least 4 tracks
                    and 25 song quality`}
                `
            },
            effect() {
                let quality = tmp.tracks.effect.quality;
                if (hasUpgrade("player", 42)) quality = Decimal.add(quality, clickableEffect("tracks", "f2"));
                let gain = Decimal.add(quality, 1).log10().pow_base(quality).floor();
                gain = gain.mul(buyableEffect("player", 12));
                if (hasUpgrade("player", 12)) gain = gain.mul(upgradeEffect("player", 12));
                return gain;
            },
            unlocked() {
                return !player.world.activeChallenge;
            },
            canClick() { 
                return tmp.tracks.effect.limit >= 4 && Decimal.gte(tmp.tracks.effect.quality, 25);
            },
            onClick() {
                let temp = tmp[this.layer].clickables[this.id];

                layers.tracks.doReset();

                player.player.exp = Decimal.add(temp.effect, player.player.exp);
            },
            style: {
                width: "150px",
                "min-height": "100px",
                "border-radius": 0,
            }
        },
        "f2": {
            display() {
                let amt = getBuyableAmount("tracks", "r1");
                let temp = tmp[this.layer].clickables[this.id];
                return `<h3>Release</h3> 

                    Release the song for the whole world to listen.

                    ${temp.canClick ? 
                   `Release your song with
                    ${formatWhole(temp.effect)} quality` : 
                   `Requires at least 7 tracks
                    and 300 song quality`}
                `
            },
            effect() {
                let gain = Decimal.add(tmp.tracks.effect.quality, tmp.movie.effect.quality);
                if (hasUpgrade("player", 25)) gain = gain.mul(1.5);
                return gain;
            },
            unlocked() { 
                return hasAchievement("journal", "2x3") && !player.world.activeChallenge;
            },
            canClick() { 
                return tmp.tracks.effect.limit >= 7 && Decimal.gte(tmp.tracks.effect.quality, 300);
            },
            onClick() {
                let temp = tmp[this.layer].clickables[this.id];

                releaseSong();
                
                layers.tracks.doReset();
            },
            style: {
                width: "150px",
                "min-height": "100px",
                "border-radius": 0,
            }
        },
        "fc": {
            display() {
                let amt = getBuyableAmount("tracks", "r1");
                let temp = tmp[this.layer].clickables[this.id];
                let chal = tmp.world.challenges[player.world.activeChallenge];
                return `<h3>Complete</h3> 

                    Complete the task.

                    Requires ${chal?.goalSummary}
                `
            },
            unlocked() { 
                return player.world.activeChallenge;
            },
            canClick() { 
                return tmp.world.challenges[player.world.activeChallenge]?.canComplete;
            },
            onClick() {
                completeChallenge("world", player.world.activeChallenge)
            },
            style: {
                width: "150px",
                "min-height": "100px",
                "border-radius": 0,
            }
        }
    },

    buyables: {
        "r1": {
            cost(x) {
                return Decimal.max(
                    Decimal.pow(5, x).mul(50),
                    Decimal.pow(2, x).pow_base(5)
                )
            },
            display() {
                let amt = getBuyableAmount("tracks", "r1");
                let cost = this.cost(amt);
                return `<h3>Expand</h3> 

                    Add +1 more track to the song

                    Requires ${formatWhole(cost)}
                    notes in track ${formatWhole(tmp.tracks.effect.limit)}
                `
            },
            canAfford() { 
                return Decimal.gte(player.tracks.notes[tmp.tracks.effect.limit - 1] ?? 0, this.cost());
            },
            buy() {
                trackReseterReset();
                player.tracks.masters = [];
                player.tracks.expandTime = 0;
                player.tracks.masterTime = 0;

                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style: {
                width: "150px",
                height: "100px",
                "border-radius": 0,
            }
        },
    },

    update(delta) {
        if (inChallenge("world", "_snail")) delta /= 100;

        for (let a = 0; a < tmp.tracks.effect.limit; a++) {
            if (player.tracks.notes[a] === undefined) player.tracks.notes.push(0);
            if (player.tracks.masters[a] === undefined) player.tracks.masters.push(0);
            if (player.tracks.extraMulti[a] === undefined) player.tracks.extraMulti.push(0);
        }

        if (player.tracks.expandTime > 0.05) {
            for (let a = 0; a < tmp.tracks.effect.limit; a++) {
                if (tmp.tracks.effect.autoLimit > a) {
                    player.tracks.notes[a] = Decimal.mul(player.points, tmp.tracks.effect.trackGain[a] ?? 1).floor().mul(delta).add(player.tracks.notes[a]);
                }
            }
        }

        if (hasChallenge("world", "c1x1")) {
            for (let a = 1; a < tmp.tracks.effect.limit; a++) {
               player.tracks.extraMulti[a - 1] = Decimal.mul(tmp.tracks.effect.trackBase[a], delta).mul(0.01).add(player.tracks.extraMulti[a - 1]);
            }
        }

        player.tracks.idleTime += delta;
        player.tracks.expandTime += delta;
        player.tracks.masterTime += delta;
        player.tracks.songTime += delta;
    },
    
    tabFormat: [
        ["column", () => hasAchievement("journal", "1x3") ? [
            "song-info",
            ["blank", "10px"],
            ["row", [["clickable", "f1"], ["clickable", "f2"], ["clickable", "fc"]]],
            ["blank", "10px"],
        ] : []],
        ["column", () => hasUpgrade("player", "14") ? [
            "song-mode",
            ["blank", "10px"],
        ] : []],
        ["column", () => Array.from(Array(tmp.tracks.effect.limit).keys()).map(x => ["note-track", x]), { width: "500px" }],
        ["blank", "10px"],
        ["row", [["buyable", "r1"]]],
    ],

    layerShown(){return true}
})