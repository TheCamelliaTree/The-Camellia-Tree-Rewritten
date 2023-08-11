let modInfo = {
	name: "Tree = Tree + 1",
	id: "bpm",
	author: "ArcanaEden (rotating_ilot)",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "ArcanaEden's Trees",
	discordLink: "https://discord.gg/BEa67qjXa4",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 2400,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "BPM",
}

let changelog = `<h1>Changelog:</h1><br>
<br>
<h2>Format: va.b.c.d</h2><br>
<br>
a and b = New updates regarding layers and stuff.<br>
c (will sometimes pop up) = Updates that are in parts, simply because some updates take longer than others.<br>
d = bug/grammatical fixes.<br>
Credit to pg132's changelog format.<br>
<br>
<br>
	<h3>v0.1</h3><br>
		- What do you expect from the first release of this tree? ToL? <br>
		- Added Beat Points`

let winText = `Your BPM was so fast that not even Kobaryo can explain.`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything", "bpmIncremental"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	gain = upgradeEffect('a', 11)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [() => `You have <h2>${format(player.points)}</h2> points.`]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(1e33)
}



// Less important things beyond this point!
function colored(layer, text, tag='h2') { return `<${tag} style='color:${temp[layer].color};text-shadow:${temp[layer].color} 0px 0px 10px;'>${text}</${tag}>` }
// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(727) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}