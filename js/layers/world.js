

function releaseSong() {
    player.world.songs.push({
        quality: tmp.tracks.effect.quality,
        stage: "publishing",
        age: 0,
        publicity: new Decimal(10),
        streams: new Decimal(0),
        money: new Decimal(0),
    });
    player.world.totalQuality = Decimal.add(player.world.totalQuality, tmp.tracks.effect.quality);
}

function claimSong(id) {
    let song = player.world.songs[id];
    console.log(id, song);
    if (song?.stage != "ended") return;
    player.player.money = Decimal.add(song.money, player.player.money);
    player.player.totalStreams = Decimal.add(song.streams, player.player.totalStreams);
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

addLayer("world", {
    name: "The Outside World",

    row: 1, 
    position: 2,
    color: "#7aaccf",
    symbol: () => "O",
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
    }},

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
                    song.streams = Decimal.pow(song.publicity, 1.2).div(10).add(song.streams);
                    song.money = Decimal.div(song.publicity, 100).add(song.money);
                    song.age++;
                    let reduction = Decimal.pow(0.995, song.age);
                    song.publicity = reduction.mul(Decimal.div(song.quality, 100).mul(reduction).sub(reduction.recip()).add(song.publicity));
                    if (song.publicity.lt(1)) {
                        song.publicity = new Decimal(0);
                        song.stage = "ended";
                    }
                }
            }
            player.world.tickTime -= 1;
        }
    },

    challenges: {
        // ------------------------------ Story tasks
        "s1": {
            ...worldTask,
            name: "Your First Request",
            challengeDescription: `
                Looks like someone requested you to make a song for them, in exchange for some money.
            `,
            goalList: [
                "Make a song with 600 quality."
            ],
            caveatList: [
                "No caveats",
            ],
            rewardList: [
                "¥100 money"
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
    },

    microtabs: {
        main: {
            distro: {
                title: "Distro",
                content: [
                    ["blank", "10px"],
                    ["column", () => Array.from(player.world.songs.keys()).map(x => ["world-song", x]), { width: "500px" }],
                ],
            },
            tasks: {
                title: "Tasks",
                content: [
                    ["blank", "10px"],
                    "task-list",
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