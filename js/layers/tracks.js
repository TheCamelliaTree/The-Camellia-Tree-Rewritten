
function canAddNotesToTrack(id) {
    if (player.tracks.actionMode == "add") {
        if (id != 0 && Decimal.lte(player.tracks.notes[0], 0)) return false;
        if (Decimal.gt(getBuyableAmount("player", 11), id)) return false;
    } else if (player.tracks.actionMode == "master") {
        if (Decimal.lte(Decimal.mul(player.tracks.notes[id], tmp.tracks.effect.masterBoost), player.tracks.masters[id])) return false;
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
        player.tracks.masters[id] = Decimal.mul(player.tracks.notes[id], tmp.tracks.effect.masterBoost);
        player.tracks.masterTime = 0;
        trackReseterReset();
    }
}

function trackReseterReset() {
    player.points = new Decimal(1);
    player.tracks.notes = [];
    player.tracks.idleTime = 0;
}

function setTrackMode(mode) {
    player.tracks.actionMode = mode;
}

addLayer("tracks", {
    name: "The Workstation",

    row: 0, 
    position: 0,
    color: "#c0c3e1",
    symbol: () => "W",

    startData() { return {
        unlocked: true,
        notes: [],
        masters: [],
        idleTime: 0,
        masterTime: 0,
        expandTime: 0,
        songTime: 0,
        actionMode: "add",
    }},

    effect() {
        let eff = {};

        eff.limit = 1 + new Decimal(getBuyableAmount("tracks", "r1")).toNumber();

        eff.noteBoost = new Decimal(1);
        if (hasUpgrade("player", 13)) eff.noteBoost = eff.noteBoost.mul(upgradeEffect("player", 13));

        eff.masterBoost = new Decimal(1);
        if (hasUpgrade("player", 24)) eff.masterBoost = eff.masterBoost.mul(upgradeEffect("player", 24));
        if (hasMilestone("player", 2)) eff.masterBoost = eff.masterBoost.mul(Decimal.max(getBuyableAmount("player", 11), 1).factorial());
        
        eff.trackBase = {};
        eff.trackPower = {};
        eff.trackBoost = {};
        eff.trackGain = {};
        eff.trackCan = {};

        eff.quality = new Decimal(0);
        eff.totalNotes = new Decimal(0);
        eff.totalPower = new Decimal(0);
        
        for (let a = 0; a < eff.limit; a++) {
            eff.totalNotes = eff.totalNotes.add(player.tracks.notes[a]);

            eff.trackBase[a] = Decimal.add(player.tracks.notes[a], 1).log(10).add(1);
            eff.trackPower[a] = Decimal.add(player.tracks.masters[a], 1).log(10).div(20).add(1).sqrt();
            
            eff.quality = eff.quality.add(eff.trackBase[a].mul(eff.trackPower[a]));
            eff.trackBoost[a] = eff.trackBase[a].pow(eff.trackPower[a]);
            
            eff.totalPower = eff.totalPower.add(eff.trackPower[a]);

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

        return eff;
    },

    tooltip() {
        return `
            <h3>The Workstation</h3><br/>
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
    },

    clickables: {
        "f1": {
            display() {
                let amt = getBuyableAmount("tracks", "r1");
                let temp = tmp[this.layer].clickables[this.id];
                return `<h3>Finish</h3> 

                    Close the song, and never touch it again.

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
            canClick() { 
                return tmp.tracks.effect.limit >= 4 && Decimal.gte(tmp.tracks.effect.quality, 25);
            },
            onClick() {
                let temp = tmp[this.layer].clickables[this.id];

                trackReseterReset();
                player.tracks.masters = [];
                setBuyableAmount(this.layer, "r1", new Decimal(0));
                player.tracks.expandTime = 0;
                player.tracks.songTime = 0;
                player.tracks.masterTime = 0;

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
                let gain = tmp.tracks.effect.quality;
                return gain;
            },
            unlocked() { 
                return hasAchievement("journal", "2x3");
            },
            canClick() { 
                return tmp.tracks.effect.limit >= 7 && Decimal.gte(tmp.tracks.effect.quality, 300);
            },
            onClick() {
                let temp = tmp[this.layer].clickables[this.id];

                releaseSong();

                trackReseterReset();
                player.tracks.masters = [];
                setBuyableAmount(this.layer, "r1", new Decimal(0));
                player.tracks.expandTime = 0;
                player.tracks.songTime = 0;
                player.tracks.masterTime = 0;
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
        for (let a = 0; a < tmp.tracks.effect.limit; a++) {
            if (player.tracks.notes[a] === undefined) player.tracks.notes.push(0);
            if (player.tracks.masters[a] === undefined) player.tracks.masters.push(0);
        }
        if (player.tracks.expandTime > 0.05) {
            for (let a = 0; a < tmp.tracks.effect.limit; a++) {
                if (Decimal.gt(getBuyableAmount("player", 11), a)) {
                    player.tracks.notes[a] = Decimal.mul(player.points, tmp.tracks.effect.trackGain[a] ?? 1).floor().mul(delta).add(player.tracks.notes[a]);
                }
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
            ["row", [["clickable", "f1"], ["clickable", "f2"]]],
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