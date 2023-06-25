

let currentMusic = {
    enabled: false,
    player: new Audio(),
    data: null,
};

function onFileDrop(event) {
    let file = null;
  
    event.preventDefault();
  
    if (event.dataTransfer.items) file = event.dataTransfer.items[0]?.getAsFile();
    else file = event.dataTransfer.files[0];

    if (file?.type.startsWith("audio")) {
        currentMusic.enabled = true;
        currentMusic.player.src = URL.createObjectURL(file);
        currentMusic.player.play();
        file.arrayBuffer().then((buffer) => {
            console.log(currentMusic.data = readMetadata(buffer));
        });
        awardAchievement("journal", "s1x1");
    }

    console.log(file);
}

function onFileDragOver(event) {
    event.preventDefault();
  
    console.log (event)
}

function readMetadata(buffer) {
    metadata = {};
    let dec = new TextDecoder("windows-1252");
    var dv = new DataView(buffer, 0);
    if (dec.decode(buffer.slice(0, 3)) == "ID3") {
        let totalLength = dv.getUint8(6) * 2 ** 21 + dv.getUint8(7) * 2 ** 14 + dv.getUint8(8) * 2 ** 7 + dv.getUint8(9);
        console.log(totalLength);
        let offset = 10;
        let tagTF = { 
            "TIT2": "trackTitle", 
            "TPE1": "trackAuthor", 
            "TALB": "albumTitle", 
            "TPE2": "albumAuthor", 
            "APIC": "mainPicture",
        }
        while (offset < totalLength) {
            let tag = dec.decode(buffer.slice(offset, offset + 4))
            let length = dv.getUint32(offset + 4);
            let data = buffer.slice(offset + 10, length + offset + 10)
            if (tag.trim() == "") {
                offset += length + 10;
                continue;
            } else if (tag == "APIC") { 
                let a = 1;
                let enc = dv.getUint8(offset + 10);
                let type = "";
                let byte = "";
                while ((byte = dv.getUint8(offset + 10 + a)) != 0) { 
                    type += String.fromCharCode(byte); 
                    a++;
                }
                if (type.includes("javascript")) throw new Error("Ehh?");
                a += 2;
                let b = [1, 2, 2, 1][enc];
                let aa = a;
                while ((b == 1 ? dv.getUint8(offset + 10 + a) : dv.getUint16(offset + 10 + a)) != 0) a += b;
                let decbe = new TextDecoder(["iso-8859-1", "ucs-2", "utf-16", "utf-8"][enc]);
                let desc = decbe.decode(data.slice(aa, a)); 
                a += b;
                console.log(type, desc, enc, a);
                let blob = new Blob([data.slice(a, length)], { type });
                let reader = new FileReader();
                reader.onload = function(data){
                    metadata[tagTF[tag] || tag] = data.target.result;
                    //cover.src = metadata.mainPicture;
                };
                reader.readAsDataURL(blob);
            } else {
                let decbe = new TextDecoder(["iso-8859-1", "ucs-2", "utf-16", "utf-8"][dv.getUint8(offset + 10)]);
                data = decbe.decode(data.slice(1, length)).trim().trim("\x00"); 
            }
            metadata[tagTF[tag] || tag] = data;
            offset += length + 10;
        }
        console.log(metadata);
    }
    return metadata;
}

/*
(function () {
    let regex = /@mspfa\s+audio\s+(?:(\d+)\s+)?(?:(\d+)\s+)?(?:(\d+)\s+)?([^;\s]+)(?:\s+([^;]+))?;?/gm;
    let argsRegex = /"([^"]+)"|'([^']+)'|`([^`]+)`|([^\s]+)/gm
    let tracks = [];
    let match;
    while (match = regex.exec(MSPFA.story.y)) {
        if (match[4].startsWith("javascript") || match[4].startsWith("data")) throw new Error("Ehh?");
        let args = { name: match[4], start: +(match[1] || 1), end: +(match[2] || match[1] || 1), volume: +(match[3] || 1), args: {} }
        if (match[5]) {
            let arg1, arg2;
            while ((arg1 = argsRegex.exec(match[5])) && (arg2 = argsRegex.exec(match[5]))) {
                arg1 = arg1[1] || arg1[2] || arg1[3] || arg1[4];
                arg2 = arg2[1] || arg2[2] || arg2[3] || arg2[4];
                args.args[arg1] = arg2;
            }
        }
        tracks.push(args);
    }

    let player, audio, cover, title, author, playpause, seek, volume;

    function getTitleName(path) {
        let str = decodeURI(path.slice(path.lastIndexOf("/") + 1));
        if (str.lastIndexOf(".")) str = str.slice(0, str.lastIndexOf("."));
        return str;
    }

    function initPlayer() {
        let style = document.createElement("style");
        style.textContent = `
            #music-player {
                position: sticky;
                width: 518px;
                height: 32px;
                margin: -16px auto 23px auto;
                padding: 9px 64px;
                text-align: left;
                color: white;
                background: black;
                border: 2px solid yellow;
                box-shadow: 0 1px 10px #0007;
                user-select: none;
            }
            #music-player.idle {
                display: none;
            }
            #music-player.popup {
                top: 7px;
                bottom: 7px;
                animation: popup .4s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            @keyframes popup {
                from {
                    top: -38px;
                    bottom: -38px;
                } to {
                    top: 7px;
                    bottom: 7px;
                }
            }
            #music-player.popup-end {
                animation: popup-end .2s ease-in;
            }
            @keyframes popup-end {
                from {
                    top: 7px;
                    bottom: 7px;
                } to {
                    top: -48px;
                    bottom: -48px;
                }
            }
            #music-cover {
                position: absolute;
                display: none;
                top: 0px;
                left: 0px;
                width: 50px;
                height: 50px;
            }
            #music-player.has-cover #music-cover {
                display: block;
            }
            #music-playpause {
                position: absolute;
                top: 0px;
                left: 0px;
                width: 52px;
                height: 50px;
                border: none;
                border-right: 2px solid yellow;
                background: transparent;
                transition: background .2s;
            }
            #music-playpause:focus {
                outline: none;
            }
            #music-playpause:hover {
                background: #fff3;
            }
            #music-player.has-cover:is(.paused, .popup, .popup-end, .seeking, .vol-seeking) #music-playpause, #music-player.has-cover:hover #music-playpause, #music-player.has-cover #music-playpause:hover {
                background: #000a;
            }
            #music-playpause::after {
                content: "";
                position: absolute;
                top: 0px;
                left: 0px;
                width: 50px;
                height: 50px;
                transition: opacity .2s, transform .2s;
            }
            #music-player.paused #music-playpause::after {
                background: conic-gradient(at 100% 50%, transparent 247.38deg, white 247.38deg 292.62deg, transparent 292.62deg);
                background-size: 24px 20px;
                background-position: 14px 15px;
                background-repeat: no-repeat;
            }
            #music-player.playing #music-playpause::after {
                background: linear-gradient(white, white), linear-gradient(white, white);
                background-size: 8px 20px, 8px 20px;
                background-position: 15px 15px, 27px 15px;
                background-repeat: no-repeat, no-repeat;
            }
            #music-player.has-cover #music-playpause::after {
                transform: scale(0);
                opacity: 0;
            }
            #music-player.has-cover:is(.paused, .popup, .popup-end, .seeking, .vol-seeking) #music-playpause::after, #music-player.has-cover:hover #music-playpause::after {
                transform: scale(1);
                opacity: 1;
            }
            #music-title {
                opacity: 1;
                transition: opacity .2s;
            }
            #music-player:is(.seeking, .vol-seeking) #music-title {
                opacity: 0;
            }
            #music-author {
                font-weight: normal;
                font-style: italic;
                opacity: 0.5;
                transition: opacity .2s;
            }
            #music-player:hover #music-title:not(:empty) + #music-author, #music-player:is(.seeking, .vol-seeking) #music-author {
                opacity: 0;
            }
            #music-progress {
                position: absolute;
                bottom: 0px;
                height: 2px;
                left: 52px;
                right: 0;
                transition: background .2s, height .2s;
            }
            #music-player:is(:hover, .seeking, .vol-seeking) #music-progress {
                background: #fff3;
                height: 15px;
            }
            #music-progress::after {
                content: "";
                position: absolute;
                top: 0px;
                bottom: 0px;
                left: 0px;
                right: calc(100% * calc(1 - var(--progress)));
                background: white;
                transition: opacity .2s;
            }
            #music-player.seeking #music-progress::after {
                right: calc(100% * calc(1 - min(var(--progress), var(--seek))));
            }
            #music-player.seeking #music-progress::before {
                content: "";
                position: absolute;
                top: 0px;
                bottom: 0px;
                left: calc(100% * min(var(--progress), var(--seek)));
                right: calc(100% * calc(1 - max(var(--progress), var(--seek))));
                background: #fff4;
            }
            #music-player.paused #music-progress::after, #music-player.paused #music-progress::before {
                opacity: 0.5;
            }
            #music-seek {
                position: absolute;
                top: 9px;
                left: 64px;
                opacity: 0;
                transition: opacity .2s;
            }
            #music-seek::after {
                content: attr(after);
                font-weight: normal;
                opacity: 0.5;
            }
            #music-player:is(.seeking, .vol-seeking) #music-seek {
                opacity: 1;
            }
            #music-volume {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 100px;
                height: 14px;
                transition: background .2s, height .2s;
                background: conic-gradient(at 0% 100%, transparent 82.030deg, #fff3 82.030deg 90deg, transparent 90deg);
                transform: translateX(50%) scaleX(0);
                transition: transform .2s;
            }
            #music-player:is(:hover, .popup, .popup-end, .seeking, .vol-seeking) #music-volume {
                transform: none;
            }
            #music-volume:after {
                content: "";
                position: absolute;
                top: calc(100% * calc(1 - var(--volume)));
                bottom: 0px;
                left: 0px;
                right: calc(100% * calc(1 - var(--volume)));
                background: conic-gradient(at 0% 100%, transparent 82.030deg, white 82.030deg 90deg, transparent 90deg);
            }
        `;
        document.head.prepend(style);
        
        player = document.createElement("div");
        player.id = "music-player";
        player.onpointerenter = (e) => {
            clearTimeout(popupTimeout);
        }
        player.onpointerleave = (e) => {
            if (popupTimeout) endPopup();
        }
        container.insertBefore(player, info);

        audio = document.createElement("audio");
        audio.autoplay = true;
        audio.loop = true;
        audio.oncanplay = (e) => {
            if (!title.textContent) {
                author.textContent = "Retrieving metadata...";
            }
        }
        player.append(audio);
        
        cover = document.createElement("img");
        cover.id = "music-cover";
        player.append(cover);
        
        playpause = document.createElement("button");
        playpause.id = "music-playpause";
        playpause.onclick = (e) => {
            audio.paused ? audio.play() : audio.pause();
        }
        player.append(playpause);
        
        title = document.createElement("div");
        title.id = "music-title";
        player.append(title);
        
        author = document.createElement("div");
        author.id = "music-author";
        player.append(author);
        
        progress = document.createElement("div");
        progress.id = "music-progress";
        progress.onpointerdown = (e) => {
            player.classList.add("seeking");
            function pointerMove(ee) {
                let rect = e.target.getBoundingClientRect();
                let val = Math.max(Math.min((ee.clientX - rect.left) / rect.width, 1), 0)
                player.style.setProperty("--seek", val);
                seek.textContent = Math.floor(val * audio.duration / 60) + ":" + Math.floor(val * audio.duration % 60).toString().padStart(2, "0");
                seek.setAttribute("after", " / " + Math.floor(audio.duration / 60) + ":" + Math.floor(audio.duration % 60).toString().padStart(2, "0"));
            }
            function pointerUp(ee) {
                let rect = e.target.getBoundingClientRect();
                audio.currentTime = Math.max(Math.min((ee.clientX - rect.left) / rect.width, 1), 0) * audio.duration;
                player.classList.remove("seeking");
                document.removeEventListener("pointermove", pointerMove);
                document.removeEventListener("pointerup", pointerUp);
            }
            document.addEventListener("pointermove", pointerMove);
            document.addEventListener("pointerup", pointerUp);
            pointerMove(e);
        }
        progress.onclick = (e) => {
            e.stopPropagation();
        }
        player.append(progress);
        
        progress = document.createElement("div");
        progress.id = "music-volume";
        progress.onpointerdown = (e) => {
            player.classList.add("vol-seeking");
            function pointerMove(ee) {
                let rect = e.target.getBoundingClientRect();
                currentVolume = Math.max(Math.min((ee.clientX - rect.left) / rect.width, 1), 0);
                audio.volume = currentTrack.volume * currentVolume;
                seek.textContent = (currentVolume * 100).toFixed(0);
                seek.setAttribute("after", " %");
            }
            function pointerUp(ee) {
                let rect = e.target.getBoundingClientRect();
                currentVolume = Math.max(Math.min((ee.clientX - rect.left) / rect.width, 1), 0);
                audio.volume = currentTrack.volume * currentVolume;
                player.classList.remove("vol-seeking");
                document.removeEventListener("pointermove", pointerMove);
                document.removeEventListener("pointerup", pointerUp);
            }
            document.addEventListener("pointermove", pointerMove);
            document.addEventListener("pointerup", pointerUp);
            pointerMove(e);
        }
        progress.onclick = (e) => {
            e.stopPropagation();
        }
        player.append(progress);
        
        seek = document.createElement("div");
        seek.id = "music-seek";
        player.append(seek);
    }
    initPlayer();

    let currentTrack = {};
    let metadata = {};
    let popupTimeout;
    let metadataPromise;

    let currentVolume = 1;

    function beginPopup() {
        clearTimeout(popupTimeout);
        player.classList.add("popup");
        popupTimeout = setTimeout(() => {
            endPopup();
        }, 5000);
    }

    function endPopup() {
        player.classList.remove("popup");
        player.classList.add("popup-end");
        setTimeout(() => {
            player.classList.remove("popup-end");
        }, 400);
        popupTimeout = 0;
    }

    function onPage(page) {
        let options = [];
        for (let track of tracks) {
            if (page >= track.start && page <= track.end) options.push(track);
        }
        if (options.length > 0) {
            if (options[0].name != currentTrack) {
                title.textContent = "";
                author.textContent = "Loading...";
                cover.removeAttribute("src");
                metadata = {};
                audio.removeAttribute("src");
                audio.currentTime = 0;
                audio.pause();
                beginPopup();
                
                audio.src = options[0].name;
                audio.volume = options[0].volume * currentVolume;
                
                let readArgs = true;
                if (options[0].args.title) { 
                    metadata.trackTitle = title.textContent = options[0].args.title;
                    readArgs = false;
                }
                if (options[0].args.author) { 
                    metadata.trackAuthor = author.textContent = options[0].args.author;
                    readArgs = false;
                }
                if (options[0].args.cover) { 
                    if (options[0].args.cover.startsWith("javascript") || options[0].args.cover.startsWith("data")) throw new Error("Ehh?");
                    metadata.mainPicture = cover.src = options[0].args.cover;
                    readArgs = false;
                }
                
                if (readArgs) {
                    
                }
            }
            currentTrack = options[0];
        } else {
            author.textContent = "Idle";
            currentTrack = title.textContent = "";
            cover.removeAttribute("src");
            metadata = {};
            audio.removeAttribute("src");
            audio.currentTime = 0;
            audio.pause();
        }
    }
    MSPFA.slide.push(onPage);
    onPage(MSPFA.p);

    function onTick() {
        player.style.setProperty("--progress", audio.currentTime / audio.duration);
        player.style.setProperty("--volume", currentVolume);
        
        player.classList.toggle("paused", audio.paused);
        player.classList.toggle("playing", !audio.paused);
        player.classList.toggle("ready", !!audio.src);
        player.classList.toggle("idle", !audio.src);
        player.classList.toggle("has-author", !!metadata.trackAuthor);
        player.classList.toggle("has-cover", !!cover.src);

        requestAnimationFrame(onTick);
    }
    onTick();
})()
*/