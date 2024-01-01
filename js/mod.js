let modInfo = {
	name: "AFK Incremental/Sim but not",
	id: "afkbutnot",
	author: "infiniteeden",
	pointsName: "time wasted",
	modFiles: ["layers.js", "tree.js"],

	discordName: "The Camellia Tree",
	discordLink: "https://discord.gg/BEa67qjXa4",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 2400,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "AFK Inc/Sim but not",
}

let changelog = `<h1>Changelog:</h1><br>
			v0.1: AFK Incremental/Simulator but not probably garbage<br>
			- Added stats<br>
			- what else do I need to add, its just an AFK game lmao`

let winText = `how did you reach this endscreen, you are suppose to be still in the game, not here`

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
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [() => `Current Endgame: Infinite Time Wasted`]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("1e999999999")
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