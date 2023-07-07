let journalAchievement = {
    onComplete: () => player.journal.potential++,
}

let journalSecretAchievement = {
    onComplete: () => player.journal.potential++,
    name() { 
        return hasAchievement(this.layer, this.id) ? this.title : "????????"
    },
    tooltip() {
        return hasAchievement(this.layer, this.id) ? this.description + "<br/>Hint: " + this.hint : this.hint;
    },
}

addLayer("journal", {
    name: "The Journal",

    row: "side", 
    position: 0,
    color: "#e0e1cc",
    symbol: () => formatWhole(player.journal.potential),

    startData() { return {
        unlocked: true,
        potential: 0,
    }},

    tooltip() {
        return `
            <h3>The Journal</h3><br/>
            ${formatWhole(player.journal.potential)} Potential
        `
    },

    achievements: {
        rows: 5,
        cols: 5,

        "1x1": {
            ...journalAchievement,
            name: "A new artist has arisen...",
            tooltip: "Write your very first note.",
            done: () => Decimal.gte(player.tracks.notes[0], 1),
        },
        "1x2": {
            ...journalAchievement,
            name: "300,000 NOTES SONG",
            tooltip: "Have a total of 300,000 notes in your song.",
            done: () => Decimal.gte(tmp.tracks.effect.totalNotes, 300000),
        },
        "1x3": {
            ...journalAchievement,
            name: "This DAW has a very familliar interface",
            tooltip: "Unlock 4 tracks.",
            done: () => tmp.tracks.effect.limit >= 4,
        },
        "1x4": {
            ...journalAchievement,
            name: "Restart",
            tooltip: "Finish a song.",
            done: () => Decimal.gte(player.player.exp, 1),
        },
        "1x5": {
            ...journalAchievement,
            name: "The Blackest MIDIs",
            tooltip: () => `Have a total of ${format(6.666e16)} notes in your song.`,
            done: () => Decimal.gte(tmp.tracks.effect.totalNotes, 6.666e16),
        },
        "2x1": {
            ...journalAchievement,
            name: "wac-a-mole",
            tooltip: "Reach 100 song quality.",
            done: () => Decimal.gte(tmp.tracks.effect.quality, 100),
        },
        "2x2": {
            ...journalAchievement,
            name: "What the hell is a \"Musical IQ\"!!??",
            tooltip: () => `Reach ${format(1e9)} experience.`,
            done: () => Decimal.gte(player.player.exp, 1e9),
        },
        "2x3": {
            ...journalAchievement,
            name: "When You See It (kinda)",
            tooltip: "Unlock floor(7.27) tracks.",
            done: () => tmp.tracks.effect.limit >= 7,
        },
        "2x4": {
            ...journalAchievement,
            name: "Hello, World",
            tooltip: "Release your first song.",
            done: () => player.world.songs.length >= 1,
        },
        "2x5": {
            ...journalAchievement,
            name: "Master Master",
            tooltip: "Reach 12 effective tracks. (Effective track amount is equal to the sum of all track's power)",
            done: () => Decimal.gte(tmp.tracks.effect.totalPower, 12),
        },
        "3x1": {
            ...journalAchievement,
            name: "Not Quite A Challenge",
            tooltip: "Complete your first request.",
            done: () => hasChallenge("world", "s1"),
        },
        "3x2": {
            ...journalAchievement,
            name: "Musical High School Graduate",
            tooltip: () => `Reach ${format(1e15)} experience.`,
            done: () => Decimal.gte(player.player.exp, 1e15),
        },
        "3x3": {
            ...journalAchievement,
            name: "Prestigious Sounds",
            tooltip: "Reach 1,000 song quality.",
            done: () => Decimal.gte(tmp.tracks.effect.quality, 1000),
        },
        "3x4": {
            ...journalAchievement,
            name: "More Than One",
            tooltip: "Complete your first collaboration.",
            done: () => hasChallenge("world", "c0x0"),
        },
        "3x5": {
            ...journalAchievement,
            name: "Wait, That's Illegal",
            tooltip: "Unlock 9 tracks.",
            done: () => tmp.tracks.effect.limit >= 9,
        },
        "4x1": {
            ...journalAchievement,
            name: "It's Movie Making Time",
            tooltip: "Unlock the Movie Maker.",
            done: () => Decimal.gt(getBuyableAmount("player", 13)),
        },
        "4x2": {
            ...journalAchievement,
            name: "A GOOGOL NOTES SONG",
            tooltip: () => `Have a total of ${format(1e100)} notes in your song.`,
            done: () => Decimal.gte(tmp.tracks.effect.totalNotes, 1e100),
        },
        "4x3": {
            ...journalAchievement,
            name: "Anti-Camellia Dimensions",
            tooltip: () => `Collaborate with Ujico*.`,
            done: () => hasChallenge("world", "c1x1"),
        },

        "s1x1": {
            ...journalSecretAchievement,
            title: "Music to my ears",
            description: "Drop a music file into the game.",
            hint: "I'm a music player",
            done: () => false,
        },
        "s1x2": {
            ...journalSecretAchievement,
            title: "SUPERTRUE",
            description: "Set an option to HYPER MODE.",
            hint: "Shift to set to hyperdrive",
            done: () => false,
        },
    },

    microtabs: {
        main: {
            stats: {
                title: "Statistics",
                content: [
                    ["blank", "10px"],
                    ["microtabs", "stats"],
                ],
            },
            achs: {
                title: "Achievements",
                content: [
                    ["blank", "10px"],
                    ["microtabs", "achs"],
                ],
            },
        },
        stats: {
            tracks: {
                title: "Workstation",
                content: [
                    ["blank", "10px"],
                    ["raw-html", () => {
                        let arr = [];

                            arr.push("Your song has a total of " + format(tmp.tracks.effect.totalNotes) + " notes.");
                            arr.push("Your song's effective track amount is " + format(tmp.tracks.effect.totalPower) + ".");

                            arr.push("");

                            arr.push("It is " + formatTime(player.tracks.idleTime) + " since the last manual track addition.");
                        hasUpgrade("player", 14) && 
                            arr.push("It is " + formatTime(player.tracks.masterTime) + " since the last manual track mastering.");
                            arr.push("It is " + formatTime(player.tracks.expandTime) + " since the last track expansion.");
                            arr.push("It is " + formatTime(player.tracks.songTime) + " since you started working on the current song.");



                        return arr.join("<br/>");
                    }],
                ],
            },
        },
        achs: {
            normal: {
                title: "Normal",
                content: [
                    ["blank", "10px"],
                    ["achievements", [1, 2, 3, 4]],
                ],
            },
            secret: {
                title: "Secret",
                content: [
                    ["blank", "10px"],
                    ["achievements", ["s1"]],
                ],
            }
        },
    },
    
    tabFormat: [
        ["raw-html", () => `
            You have ${colored("journal", formatWhole(player.journal.potential))} potential.<br/>
            You gain 1 potential for each achievement and story entry you unlocked.<br/>
            Secret achievements also count toward the potential counter.
        `],
        ["blank", "20px"],
        ["microtabs", "main"],
    ],

    layerShown(){return true}
})