

function releaseSong() {
    let song = {
        quality: tmp.tracks.clickables.f2.effect,
        stage: "publishing",
        age: 0,
        publicity: tmp.world.effect.basePublicity,
        streams: new Decimal(0),
        money: new Decimal(0),
    };
    if (hasMilestone("player", 3)) song.fans = new Decimal(0);
    player.world.songs.push(song);
    player.world.totalQuality = Decimal.add(player.world.totalQuality, tmp.tracks.effect.quality);
}

function claimSong(id) {
    let song = player.world.songs[id];
    console.log(id, song);
    if (song?.stage != "ended") return;
    player.player.money = Decimal.add(song.money, player.player.money);
    player.player.totalStreams = Decimal.add(song.streams, player.player.totalStreams);
    if (song.fans) player.player.fans = Decimal.add(song.fans, player.player.fans);
    player.world.songs.splice(id, 1);
}

let worldTask = {
    onEnter() {
        layers.tracks.doReset("world");
    },
    onExit() {
        layers.tracks.doReset("world");
    },
}

let worldCollab = {
    ...worldTask,
    name: function() { return "Collaboration with " + this.collaber },
    unlocked() {
        for (let n of this.neighbors) {
            if (!hasChallenge("world", n)) return false;
        }
        return true;
    }, 
    onComplete() {
        player.world.totalCollabs++;
    },
}

addLayer("world", {
    name: "The Outside World",

    row: 1, 
    position: 2,
    color: "#7aaccf",
    symbol: () => "🌎",
    layerShown() {
        return hasAchievement("journal", "2x4");
    },

    tooltip() {
        return `
            <h3>The Outside World</h3><br/>
            ${formatWhole(player.world.songs.length)} songs
        `
    },

    startData() { return {
        unlocked: true,
        totalQuality: new Decimal(0),
        tickTime: 0,
        songs: [],
        selectedCollab: "0x0",
        totalCollabs: 0,
    }},

    effect() {
        let eff = {};

        let chal = layers.world.challenges[player.world.activeChallenge];
        if (chal?.timeLimit) {
            eff.timeLimit = true;
            eff.timeLeft = chal.timeLimit - player.tracks.songTime;
        }
        else {
            eff.timeLeft = tmp.world.effect?.timeLeft ?? 0;
        }

        eff.basePublicity = Decimal.add(10, player.player.fans);
        if (hasChallenge("world", "s2")) eff.basePublicity = eff.basePublicity.add(25);

        eff.resMultis = {
            streams: new Decimal(1),
            money: new Decimal(1),
            fans: new Decimal(1),
        }

        if (hasChallenge("world", "c0x1")) {
            eff.resMultis.money = eff.resMultis.money.mul(1.11);
            eff.resMultis.fans = eff.resMultis.fans.mul(1.11);
            eff.basePublicity = eff.basePublicity.mul(1.11);
        }
        if (hasChallenge("world", "c-1x1")) {
            eff.resMultis.fans = eff.resMultis.fans.mul(player.world.totalCollabs + 1);
        }

        return eff;
    },

    update(delta) {
        player.world.tickTime += delta / 2;

        if (player.world.tickTime >= 1) {
            for (let song of player.world.songs) {
                if (song.stage == "publishing") {
                    song.age += 0.1;
                    if (song.age >= 1) {
                        song.stage = "gathering";
                        song.age = 0;
                    }
                } else if (song.stage == "gathering") {
                    song.streams = Decimal.pow(song.publicity, 1.2).div(10).mul(tmp.world.effect.resMultis.streams).add(song.streams);
                    song.money = Decimal.div(song.publicity, 100).mul(tmp.world.effect.resMultis.money).add(song.money);
                    if (song.fans) song.fans = Decimal.pow(song.publicity, 0.4).div(100).mul(tmp.world.effect.resMultis.fans).add(song.fans);
                    song.age++;
                    let reduction = Decimal.pow(0.995, song.age);
                    song.publicity = reduction.mul(Decimal.div(song.quality, 100).mul(reduction).add(song.publicity)).sub(reduction.recip());
                    if (song.publicity.lt(1)) {
                        song.publicity = new Decimal(0);
                        song.stage = "ended";
                    }
                }
            }
            player.world.tickTime -= 1;
        }

        let chal = layers.world.challenges[player.world.activeChallenge];
        if (chal?.timeLimit && player.tracks.songTime >= chal.timeLimit) {
            let chalData = layers.world.challenges[player.world.activeChallenge];
            run(chalData.onExit, chalData);
            player.world.activeChallenge = null;
        }
    },

    challenges: {
        // ------------------------------ Story tasks
        "s1": {
            ...worldTask,
            name: "Your First Request",
            challengeDescription: `
                Looks like someone requested you to make a song for them, in exchange for some money. You see no
                reason to decline, considering that amount of money would be helpful to get yourself stuff to upgrade
                your workstation.
            `,
            goalSummary: "600 song quality",
            goalList: [
                "Make a song with 600 quality."
            ],
            caveatList: [
                "No caveats",
            ],
            rewardList: [
                "¥100 money."
            ],
            unlocked() {
                return Decimal.gte(player.world.totalQuality, 2500);
            }, 
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 600);
            },
            onComplete() {
                player.player.money = Decimal.add(player.player.money, 100);
            },
        },
        "s2": {
            ...worldTask,
            name: "Your First Publisher",
            challengeDescription: `
                The person seems to be happy with your provided track, so much that they would like to introduce you
                to a small publishing network that they like. You'd need to provide a quick track to introduce yourself
                however, and they have a strict deadline policy.
            `,
            goalSummary: "650 song quality",
            goalList: [
                "Make a song with 650 quality in 5 minutes."
            ],
            caveatList: [
                "No caveats",
            ],
            rewardList: [
                "+25 base song publicity."
            ],
            timeLimit: 300,
            unlocked() {
                return hasChallenge("world", "s1");
            }, 
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 650);
            },
        },
        "c0x0": {
            ...worldCollab,
            collaber: "Simple Sound Maker",
            challengeDescription: `
                You got your first collaboration invitation! Seems like it's a great opportunity to learn more about what
                you're doing, and also you two could get some of each other's fans as a bonus.
            `,
            goalSummary: "1e45 mastered notes",
            goalList: [
                "Make a song with 1e45 total mastered notes."
            ],
            caveatList: [
                "Your idea count is hardcapped at 1e10.",
            ],
            rewardList: [
                "Unlock the Collab Tree.",
                "Increase the track amount by 1 after the current song time passes 5 minutes.",
            ],
            countsAs: ["_simple"],
            unlocked() {
                return hasChallenge("world", "s2");
            }, 
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.totalMasters, 1e45);
            },
        },
        "c1x-1": {
            ...worldCollab,
            collaber: "Akira Complex",
            challengeDescription: `
                [placeholder]
            `,
            goalSummary: "1,000 song quality",
            goalList: [
                "Make a song with 1,000 quality."
            ],
            caveatList: [
                "Automation is disabled.",
            ],
            rewardList: [
                "Notes from mastering is raised to the power of ^1.11.",
            ],
            countsAs: ["_noauto"],
            neighbors: ["c0x0"],
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 1000);
            },
        },
        "c0x1": {
            ...worldCollab,
            collaber: "kors k",
            challengeDescription: `
                [placeholder]
            `,
            goalSummary: "1,500 song quality",
            goalList: [
                "Make a song with 1,500 quality."
            ],
            caveatList: [
                "No caveats",
            ],
            rewardList: [
                "1.11× money gain.",
                "1.11× fan gain.",
                "1.11× base publicity.",
            ],
            neighbors: ["c0x0"],
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 1500);
            },
        },
        "c-1x-1": {
            ...worldCollab,
            collaber: "xi",
            challengeDescription: `
                [placeholder]
            `,
            goalSummary: "1,111 song quality",
            goalList: [
                "Make a song with 1,111 quality in 5 minutes."
            ],
            caveatList: [
                "No caveats",
            ],
            rewardList: [
                "Note gain is multiplied by ×11 during the first 11 seconds of a song extension.",
            ],
            timeLimit: 300,
            neighbors: ["c0x0"],
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 1111);
            },
        },
        "c-1x1": {
            ...worldCollab,
            collaber: "Kankitsu",
            challengeDescription: `
                [placeholder]
            `,
            goalSummary: "1,500 song quality",
            goalList: [
                "Make a song with 1,500 quality in 5 minutes."
            ],
            caveatList: [
                "No caveats",
            ],
            rewardList: [
                "Each artist you collaborated gives you a +1 base fan gain multiplier.",
            ],
            neighbors: ["c0x1"],
            timeLimit: 300,
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 1500);
            },
        },
        "c1x1": {
            ...worldCollab,
            collaber: "Ujico*",
            challengeDescription: `
                [placeholder]
            `,
            goalSummary: "1,500 song quality",
            goalList: [
                "Make a song with 1,500 quality."
            ],
            caveatList: [
                "Time flows 100× slower.",
                "All tracks are automatic and notes can't be added manually.",
            ],
            rewardList: [
                "Each track's base multiplier produces the above track's base multiplier (does not affect song quality).",
            ],
            neighbors: ["c0x1"],
            countsAs: ["_snail"],
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 1500);
            },
        },
        "c-2x0": {
            ...worldCollab,
            collaber: "Team Grimoire",
            challengeDescription: `
                [placeholder]
            `,
            goalSummary: "3,000 song quality",
            goalList: [
                "Make a song with 3,000 quality."
            ],
            caveatList: [
                "Your idea gain is divided by /10 for every minute spent in this song.",
            ],
            rewardList: [
                "Add 10 minutes to all row III expertise upgrades that depends on a timer.",
            ],
            neighbors: ["c-1x-1"],
            countsAs: ["_decay"],
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 3000);
            },
        },
        "c-1x-2": {
            ...worldCollab,
            collaber: "Laur",
            challengeDescription: `
                [placeholder]
            `,
            goalSummary: "2,500 song quality",
            goalList: [
                "Make a song with 2,500 quality."
            ],
            caveatList: [
                "Your song quality is reduced by 100 for every minute spent in the last song expansion (min 0).",
            ],
            rewardList: [
                "Add 1,000 quality to all row III expertise upgrades that depends on your song quality.",
            ],
            neighbors: ["c-1x-1"],
            countsAs: ["_decay2"],
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 2500);
            },
        },
        "c2x0": {
            ...worldCollab,
            collaber: "Iriss",
            challengeDescription: `
                [placeholder]
            `,
            goalSummary: "1,500 song quality",
            goalList: [
                "Make a song with 1,500 quality in 2 minutes."
            ],
            caveatList: [
                "Automation is disabled.",
            ],
            rewardList: [
                "Halve your movie clip price for every minute you spent on the current song."
            ],
            neighbors: ["c1x-1"],
            countsAs: ["_noauto"],
            timeLimit: 120,
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 1500);
            },
        },
        "c1x-2": {
            ...worldCollab,
            collaber: "NAOKI",
            challengeDescription: `
                [placeholder]
            `,
            goalSummary: "2,500 song quality",
            goalList: [
                "Make a song with 2,500 quality in 1 minute."
            ],
            caveatList: [
                "No caveats",
            ],
            rewardList: [
                "Reduce <b>Simple Sound Maker</b>'s time by 1 minute."
            ],
            neighbors: ["c1x-1"],
            timeLimit: 60,
            canComplete() {
                return Decimal.gte(tmp.tracks.effect.quality, 2500);
            },
        },
    },

    clickables: {
        "ct": {
            display() {
                return `Open the<br><h3>Collab Tree</h3>`
            },
            unlocked() {
                return hasChallenge("world", "c0x0");
            },
            canClick() { 
                return true;
            },
            onClick() {
                let title = "The Collab Tree";
                if (Math.random() < 0.1) {
                    title = [
                        "The Collaboration Tree",
                        "The Collabinatree",
                    ];
                    title = title[Math.floor(Math.random() * title.length)];
                }
                showModal(title, ["collab-tree"]);
            },
            style: {
                width: "150px",
                "min-height": "100px",
                "border-radius": 0,
            }
        }
    },

    microtabs: {
        main: {
            distro: {
                title: "Distro",
                content: [
                    ["blank", "10px"],
                    ["column", () => Array.from(player.world.songs.keys()).map(x => ["world-song", x]), { width: "500px" }],
                    ["raw-html", () => player.world.songs.length ? "" : `
                        <br><br><h3>No songs?</h3><br/>
                        Songs that you released via the Tracker will appear here.
                    `],
                ],
            },
            tasks: {
                title: "Tasks",
                content: [
                    ["blank", "10px"],
                    "task-list",
                    ["column", () => hasChallenge("world", "c0x0") ? [
                        ["blank", "10px"],
                        ["raw-html", `You've collaborated with ${colored("world", formatWhole(player.world.totalCollabs))} artists.`],
                        ["clickable", "ct"],
                        ["blank", "10px"],
                    ] : []],
                    ["task", () => "c" + player.world.selectedCollab],
                ],
            },
        },
    },
    
    tabFormat: [
        ["raw-html", () => `Your total song quality is ${colored("world", formatWhole(player.world.totalQuality))}.`],
        ["blank", "20px"],
        ["microtabs", "main"],
    ],
})