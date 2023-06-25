let modInfo = {
	name: "The Camellia Tree",
	id: "cametek",
	author: "Not Cametek (Halloweeb#4371 collabing with Flustix#5433 (foreshadowing something))",
	pointsName: "ideas",
	modFiles: [
		"tree.js",
		"layers/journal.js",
		"layers/tracks.js",
		"layers/player.js",
		"layers/world.js",
	],

	discordName: "ArcanaEden's Trees",
	discordLink: "https://discord.gg/BEa67qjXa4",
	initialStartPoints: new Decimal (1),
	offlineLimit: 1,
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "I WANNA BE THE KAMILLER",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v1.0</h2>
	<i>- I WANNA BE THE KAMILLER -</i><br>
		- Rewritten <i><u>BASICALLY EVERYTHING</u></i>.<br>
`

let winText = `Your songs went viral, too viral that you completed the tree! (Camellia if you see this I spent too long making this, so please tell me if this is good...)<br>
			Please make sure to join Camellia's Official Discord Server if you support his music and possibly the tree as well!<br>
			https://discord.gg/camellia`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) return new Decimal(0);

	let gain = tmp.tracks.effect.trackBoost[0];
	if (hasUpgrade("player", 11)) gain = gain.mul(upgradeEffect("player", 11));
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = []

// Determines when the game "ends"
function isEndgame() {
	return hasAchievement("journal", "3x1");
}



// Less important things beyond this point!
function colored(layer, text, tag='h2') { return `<${tag} style='color:${temp[layer].color};text-shadow:${temp[layer].color} 0px 0px 10px,black 0px 0px 10px;'>${text}</${tag}>` }
// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(727) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion) {
}