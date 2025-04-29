
/// Get the intersections of two triangular waves.
function getIntersections(period1, period2, offset, timeLimit) {
    let time = 0;
    let list = [];
    if (Number.isFinite(period2)) {
        while (time < timeLimit) {
            let time2 = Math.min(
                (Math.floor(time / period1) + 1) * period1,
                (Math.floor(time / period2 + offset * 2) + 1) * period2 - offset * period2 * 2,
                timeLimit
            );

            // Unstuck itself if a floating point error infinite loop is detected
            if (time == time2) {
                if (time == 0) time += Number.EPSILON;
                else time *= 1.0000000001;
                continue;
            }
    
            let s1 = Math.floor(time / period1) % 2 == 0 ? 1 : -1;
            let s2 = Math.floor(time / period2 + offset * 2) % 2 == 0 ? 1 : -1;
            let t1 = 2 * Math.floor(time / period1 / 2) + 1;
            let t2 = 2 * Math.floor(time / period2 / 2 + offset) + 1;
    
            // Solve s1 * (time / period1 - t1) = s2 * (time / period2 - t2 - 2 * offset) for time
            x = (t1 * s1 - t2 * s2 + 2 * offset * s2) / (s1 / period1 - s2 / period2)
    
            if (x > time && x <= time2) list.push(x);
    
            time = time2;
        }
    } else {
        let count = 0;
        offset = pingPong(offset * 2);
        while (time < timeLimit) {
            let s1 = count % 2 == 0 ? 1 : -1;
            let t1 = 2 * Math.floor(time / period1 / 2) + 1;

            // Solve s1 * (time / period1 - t1) + 1 = offset for time
            let x = ((offset - 1) / s1 + t1) * period1;

            if (x > time && x <= timeLimit) list.push(x);
    
            count++;
            time = period1 * count;
        }
    }
    return list;
}

function pingPong(num) {
    return 2 * Math.abs(num / 2 - Math.floor(num / 2 + 0.5));
}

function updateRecordCanvas() {
    if (tmp.record.waveCanvas) {
        let can = tmp.record.waveCanvas;
        let ctx = can.getContext("2d");
        if (!tmp.record.waveCanvas.inited) {
            tmp.record.waveCanvas.inited = true;
            ctx.clearRect(0, 0, can.width, can.height);
            ctx.fillStyle = "#fff4";
            ctx.fillRect(0, 39, 500, 2);
        } 
        if (currentRecording) {
            let time = Date.now() - currentRecording.startTime;
            let waves = Math.min(time / currentRecording.duration) * can.width;
            ctx.fillStyle = "#fffa";
            while (currentRecording.waves < waves) {
                let int = currentRecording.waveIntensity;
                for (let a = 0; a < 2; a++) {
                    let height = Math.random() ** (1 / int) * Math.max(int / 2, 1) * (0.8 - int / 5) + int / 5;
                    ctx.fillRect(currentRecording.waves, can.height * (1 - height) / 2, 1, can.height * height);
                }
                currentRecording.waves++;
                currentRecording.waveIntensity *= 0.975;
            }
        }
    } else if (!player.record.autoRecord) {
        endRecordingChallenge();
    }
    if (tmp.record.recCanvas) {
        let can = tmp.record.recCanvas;
        let ctx = can.getContext("2d");
        ctx.clearRect(0, 0, can.width, can.height);

        ctx.fillStyle = "#0104";
        ctx.fillRect(20, 20, can.width - 40, can.height - 40);
        ctx.strokeStyle = "#fff7";
        ctx.lineWidth = 1;
        ctx.strokeRect(19.5, 19.5, can.width - 41, 0);
        ctx.strokeRect(19.5, can.height - 19.5, can.width - 41, 0);

        if (currentRecording) {
            let time = Date.now() - currentRecording.startTime;
            let blink = currentRecording.duration - Math.abs(time * 2 - currentRecording.duration);
            let dispTime = Math.min(Math.max(time, 0), currentRecording.duration);
            
            if (time < 0) {
                ctx.fillStyle = "#fff";
                ctx.globalAlpha = (1 - (1500 + time) / 1500) * .3;
                let pos = Math.min((time + 1500) * currentRecording.speed / 1000, 1);
                ctx.fillRect(20, 20, (can.width - 40) * pos, can.height - 40);
                ctx.globalAlpha = 1;
            }

            ctx.fillStyle = "#ff0";
            for (let tick of currentRecording.ticks) {
                let pos = pingPong(dispTime * tick.speed / 1000 + tick.offset * 2);
                ctx.fillRect((can.width - 40) * pos + 19, 29, 2, can.height - 60);
            }
            if (blink % 500 > 0 || blink % 500 < -250) {
                ctx.fillStyle = "#f33";
                let pos = pingPong(dispTime * currentRecording.speed / 1000);
                ctx.fillRect((can.width - 40) * pos + 19, 25, 2, can.height - 50);
                
                ctx.fillStyle = "#fff";
                ctx.strokeStyle = "#f33";
                ctx.lineWidth = 2;
                ctx.fillRect((can.width - 40) * pos + 15, 15, 10, 10);
                ctx.fillRect((can.width - 40) * pos + 15, can.height - 25, 10, 10);
                ctx.strokeRect((can.width - 40) * pos + 15, 15, 10, 10);
                ctx.strokeRect((can.width - 40) * pos + 15, can.height - 25, 10, 10);
            }
        }
    }

    if (currentRecording) {
        let time = Date.now() - currentRecording.startTime;

        while (currentRecording.autoTimes.length && time >= currentRecording.autoTimes[0]) {
            registerRecord(currentRecording.autoTimes[0]);
            currentRecording.autoTimes.shift();
        }
        if (time >= currentRecording.duration + 1500) {
            endRecordingChallenge();
        }
    }
}

let currentRecording = null;
let recCanvasInterval = null;

function startRecordingChallenge() {
    if (currentRecording) return;

    let level = getBuyableAmount("record", 11).toNumber();

    let chaos = Math.floor((level / 10) ** 0.5);
    let hits = Math.max(Math.round((level / 5 + 1) / (chaos + 1) ** 2), 1);
    let speed = (level / 2 + 1) / 3 / hits / (chaos + 1) ** 2;

    currentRecording = {
        startTime: Date.now() + 1500,
        duration: 6000,
        speed: 0.75 * speed + Math.random() * .25,
        ticks: [],
        times: [],
        autoTimes: [],
        quality: new Decimal(0),
        qualityPerHit: new Decimal(0),
        waves: 0,
        waveIntensity: 0.2,
    }

    let speedMult = 1;
    if (player.record.autoRecord) {
        speedMult *= buyableEffect("record", 21);
    }
    if (speedMult > 1) {
        currentRecording.duration /= speedMult;
        speed *= speedMult;
    }

    let durationMult = 1;
    if (player.record.autoRecord) {
        durationMult *= buyableEffect("record", 22).duration;
    }
    if (durationMult > 1) {
        currentRecording.duration *= durationMult;
    }

    for (let a = 0; a < hits; a++) {
        let tick = {
            offset: (Math.random() * .6 + .2 + a) / hits / 2,
            speed: Math.random() * chaos * 0.1 * speedMult,
        }
        if (Math.random() < 0.5) tick.offset = 1 - tick.offset;
        currentRecording.ticks.push(tick);
        currentRecording.times.push(...getIntersections(1000 / currentRecording.speed, 1000 / tick.speed, tick.offset, currentRecording.duration))
    }

    let totalQuality = buyableEffect("record", 11).quality;
    currentRecording.qualityPerHit = totalQuality.div(currentRecording.times.length);

    currentRecording.times.sort((a, b) => a - b);

    if (player.record.autoRecord) {
        let variance = new Decimal(buyableEffect("record", 12)).toNumber();
        for (let time of currentRecording.times) {
            currentRecording.autoTimes.push(time + (Math.random() * 2 - 1) * variance);
        }
        currentRecording.autoTimes.sort((a, b) => a - b);
    }

    recCanvasInterval = setInterval(updateRecordCanvas, 0);
    player.record.lastQuality = currentRecording.quality;
    if (tmp.record.waveCanvas) tmp.record.waveCanvas.inited = false;
}

function endRecordingChallenge() {
    if (!currentRecording) return;

    player.record.quality = Decimal.max(player.record.quality, currentRecording.quality);

    currentRecording = null;
    if (recCanvasInterval !== null) clearInterval(recCanvasInterval);
}

function registerRecord(ms) {
    if (!currentRecording || !currentRecording.times.length) return;
    let time = ms ?? Date.now() - currentRecording.startTime;
    let diff = time - (currentRecording.times[0] || 0);
    let diffAbs = Math.abs(diff);
    let pos = pingPong(Math.max(time, 0) * currentRecording.speed / 1000);
    let rect = tmp.record.recCanvas?.getBoundingClientRect();

    let judgeText = "";
    let weight = 0;

    if (diffAbs > 100) {
        judgeText = "EXTREMELY " + (diff > 0 ? "LATE" : "EARLY");
        weight = 0.1;
    } else if (diffAbs > 83) {
        judgeText = "VERY " + (diff > 0 ? "LATE" : "EARLY");
        weight = 0.2;
    } else if (diffAbs > 66) {
        judgeText = "NOTICABLY " + (diff > 0 ? "LATE" : "EARLY");
        weight = 0.4;
    } else if (diffAbs > 50) {
        judgeText = "PRETTY " + (diff > 0 ? "LATE" : "EARLY");
        weight = 0.6;
    } else if (diffAbs > 33) {
        judgeText = "SLIGHTLY " + (diff > 0 ? "LATE" : "EARLY");
        weight = 0.8;
    } else if (diffAbs > 16) {
        judgeText = "PERFECT!";
        weight = 1;
    } else {
        judgeText = "PERFECT!!!";
        weight = buyableEffect("record", 23);
    }

    if (diffAbs > 33) player.record.streak = 0;
    else player.record.streak++;

    currentRecording.waveIntensity = 2 * weight;
    let gain = Decimal.mul(currentRecording.qualityPerHit, weight);
    currentRecording.quality = gain.add(currentRecording.quality);
    player.record.exp = Decimal.mul(gain, tmp.record.effect.expMult).add(player.record.exp);
    player.record.lastQuality = currentRecording.quality;

    if (rect) {
        makeParticles({
            x: rect.left - 70 + pos * (rect.width - 40),
            y: rect.top,
            width: 200,
            time: 2,
            speed: 5,
            image: "",
            class: "judgment",
            text: `<div style='font-size: 15px;text-align: center;width: 200px'>
                <h3>${judgeText}</h3><br/>
                ${formatWhole(diff)}ms<br/>
                ${formatWhole(gain)} <span class="symbol">magic_button</span>
            </div>`
        })
    }
    currentRecording.times.shift()
}

addLayer("record", {
    name: "The Recorder",

    row: 0, 
    position: -1,
    color: "#caccd1",
    symbol: () => "🎙",

    startData() { return {
        unlocked: true,
        quality: new Decimal(0),
        lastQuality: new Decimal(0),
        autoRecord: false,
        selfRecord: false,
        exp: new Decimal(0),
        streak: 0,
    }},

    effect() {
        let eff = {};

        eff.quality = player.record.quality;

        eff.expMult = buyableEffect("record", 13);
        if (player.record.autoRecord) eff.expMult = eff.expMult.mul(buyableEffect("record", 22).expMulti)

        return eff;
    },

    waveCanvas: () => document.getElementById("wave-canvas"),
    recCanvas: () => document.getElementById("rec-canvas"),

    tooltip() {
        return `
            <h3>The Recorder</h3><br/>
            ${format(tmp.record.effect.quality)} quality
        `
    },

    doReset(layer) {
        player.record.quality = player.record.lastQuality = new Decimal(0);
        player.record.exp = new Decimal(0);
        player.record.autoRecord = player.record.selfRecord = false;
        for (let id of ["11", "12", "13"]) setBuyableAmount("record", id, 
            new Decimal(hasChallenge("world", "c1x3") ? 1 : 0)
        );
    },

    update(delta) {
        if (inChallenge("world", "c1x3")) player.record.autoRecord = true;
        if (!currentRecording && player.record.selfRecord) startRecordingChallenge();
        updateRecordCanvas();
    },
    
    buyables: {
        11: {
            display() {
                let amt = getBuyableAmount(this.layer, this.id);
                let eff = buyableEffect(this.layer, this.id);
                let cost = tmp[this.layer].buyables[this.id].cost;
                return `<h3>Level Up ×${formatWhole(amt)}</h3> 

                    Make the recording process slightly harder for more potential quality.

                    Currently: ${formatWhole(eff.quality)} base maximum quality

                    Cost: ${formatWhole(cost)} sparkles
                `
            },
            effect(x) {
                return {
                    quality: Decimal.pow(x, 2).mul(10).add(Decimal.mul(x, 90)).add(1000),
                }
            },
            cost(x) {
                return Decimal.pow(2, x).mul(1000)
            },
            canAfford() { 
                return Decimal.gte(player.record.exp, this.cost());
            },
            buy() {
                player.record.exp = Decimal.sub(player.record.exp, this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style: {
                width: "160px",
                height: "160px",
                "border-radius": 0,
            }
        },
        12: {
            display() {
                let amt = getBuyableAmount(this.layer, this.id);
                let eff = buyableEffect(this.layer, this.id);
                let cost = tmp[this.layer].buyables[this.id].cost;
                return `<h3>Auto-Record ×${formatWhole(amt)}</h3> 

                    ${Decimal.gt(amt, 0) ? "Improve the auto-recording timing accuracy." : "Unlock the ability to automatically record, albeit with not-so-great accuracy." }

                    Currently: ${Decimal.gt(amt, 0) ? `±${formatWhole(eff)}ms timing variance` : "Not unlocked."}

                    Cost: ${formatWhole(cost)} sparkles
                `
            },
            effect(x) {
                return Decimal.sub(x, 1).pow_base(0.9).mul(200);
            },
            cost(x) {
                return Decimal.add(x, 2).factorial().mul(2000)
            },
            canAfford() { 
                return Decimal.gte(player.record.exp, this.cost());
            },
            buy() {
                player.record.exp = Decimal.sub(player.record.exp, this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style: {
                width: "160px",
                height: "160px",
                "border-radius": 0,
            }
        },
        13: {
            display() {
                let amt = getBuyableAmount(this.layer, this.id);
                let eff = buyableEffect(this.layer, this.id);
                let cost = tmp[this.layer].buyables[this.id].cost;
                return `<h3>Better Mixing ×${formatWhole(amt)}</h3> 

                    Double the amount of sparkles gained.

                    Currently: ×${formatWhole(eff)} sparkle gains

                    Cost: ${formatWhole(cost)} sparkles
                `
            },
            effect(x) {
                return Decimal.pow(2, x)
            },
            cost(x) {
                return Decimal.pow(2.5, x).mul(5000)
            },
            canAfford() { 
                return Decimal.gte(player.record.exp, this.cost());
            },
            buy() {
                player.record.exp = Decimal.sub(player.record.exp, this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style: {
                width: "160px",
                height: "160px",
                "border-radius": 0,
            }
        },
        21: {
            display() {
                let amt = getBuyableAmount(this.layer, this.id);
                let eff = buyableEffect(this.layer, this.id);
                let cost = tmp[this.layer].buyables[this.id].cost;
                return `<h3>Self-Record ×${formatWhole(amt)}</h3> 

                    ${Decimal.gt(amt, 0) ? "Increase the speed of recording when Auto-Record is active." : "Unlock the ability to automatically start recording." }

                    Currently: ${Decimal.gt(amt, 0) ? `${format(eff, 1)}× speed` : "Not unlocked."}

                    Cost: ${formatWhole(cost)} sparkles
                `
            },
            unlocked() {
                return hasChallenge("world", "c0x2");
            },
            effect(x) {
                return 1 + .2 * Decimal.sub(x, 1).max(0).toNumber()
            },
            cost(x) {
                return Decimal.add(10, x).pow(Decimal.sub(x, 1).max(0)).mul(1e6)
            },
            canAfford() { 
                return Decimal.gte(player.record.exp, this.cost());
            },
            buy() {
                player.record.exp = Decimal.sub(player.record.exp, this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style: {
                width: "160px",
                height: "160px",
                "border-radius": 0,
            }
        },
        22: {
            display() {
                let amt = getBuyableAmount(this.layer, this.id);
                let eff = buyableEffect(this.layer, this.id);
                let cost = tmp[this.layer].buyables[this.id].cost;
                return `<h3>Longer Samples ×${formatWhole(amt)}</h3> 

                    Increase the duration and sparkle gains when Auto-Record is active.

                    Currently: ${format(eff.duration, 1)}× duration, ×${format(eff.expMulti, 1)} sparkle gains

                    Cost: ${formatWhole(cost)} sparkles
                `
            },
            unlocked() {
                return hasChallenge("world", "c0x2");
            },
            effect(x) {
                let eff = {}
                eff.duration = 1 + .2 * (new Decimal(x)).toNumber()
                eff.expMulti = Decimal.pow(eff.duration, 2);
                return eff;
            },
            cost(x) {
                return Decimal.add(5, x).pow(x).mul(5e6)
            },
            canAfford() { 
                return Decimal.gte(player.record.exp, this.cost());
            },
            buy() {
                player.record.exp = Decimal.sub(player.record.exp, this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style: {
                width: "160px",
                height: "160px",
                "border-radius": 0,
            }
        },
        23: {
            display() {
                let amt = getBuyableAmount(this.layer, this.id);
                let eff = buyableEffect(this.layer, this.id);
                let cost = tmp[this.layer].buyables[this.id].cost;
                return `<h3>More Perfect ×${formatWhole(amt)}</h3> 

                    Increase quality multiplier of "PERFECT!!!" hits (the ones with 3 exclamation marks).

                    Currently: ${format(eff, 2)}× quality

                    Cost: ${formatWhole(cost)} sparkles
                `
            },
            unlocked() {
                return hasChallenge("world", "c0x2");
            },
            effect(x) {
                return Decimal.add(x, 1).pow(2).div(100).add(1);
            },
            cost(x) {
                return Decimal.pow(10, x).mul(1e9)
            },
            canAfford() { 
                return Decimal.gte(player.record.exp, this.cost());
            },
            buy() {
                player.record.exp = Decimal.sub(player.record.exp, this.cost());
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            style: {
                width: "160px",
                height: "160px",
                "border-radius": 0,
            }
        },
    },
    
    tabFormat: [
        "record-info",
        "the-recorder",
        ["blank", "10px"],
        ["column", () => !currentRecording ? [
            ["raw-html", `You have ${colored("record", formatWhole(player.record.exp))} sparkles.`],
            ["blank", "10px"],
            ["column", Decimal.gt(getBuyableAmount("record", 12), 0) ? [
                ["row", [
                    ["raw-html", "Auto-Record&nbsp;"],
                    ["toggle", ["record", "autoRecord"]],
                    ...(Decimal.gt(getBuyableAmount("record", 21), 0) ? [
                        ["raw-html", "&nbsp;Self-Record&nbsp;"],
                        ["toggle", ["record", "selfRecord"]]
                    ] : [])
                ]],
                ["blank", "10px"],
            ] : []],
            ["buyables", "1"],
            ["buyables", "2"],
        ] : [
            ["column", Decimal.gt(getBuyableAmount("record", 21), 0) ? [
                ["row", [
                    ["raw-html", "Auto-Record: " + (player.record.autoRecord ? "ON" : "OFF") + " &nbsp;Self-Record&nbsp;"],
                    ["toggle", ["record", "selfRecord"]]
                ]],
                ["blank", "10px"],
            ] : []],
        ]],
    ],

    layerShown(){ return hasChallenge("world", "c0x2") || inChallenge("world", "c0x2") }
})