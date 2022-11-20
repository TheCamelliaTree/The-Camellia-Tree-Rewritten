let modInfo = {
	name: "The Camellia Tree",
	id: "mymod",
	author: "Not Cametek",
	pointsName: "notes",
	modFiles: ["layers.js", "tree.js"],

	discordName: "The Camellia Tree",
	discordLink: "https://discord.gg/BEa67qjXa4",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "A new beginning...",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1</h3><br>
		- Added Songs and Albums.<br>
		- Endgame is Paroxysm Layer.`

let winText = `Your songs went viral, too viral that you completed the tree! (Camellia if you see this I spent too long making this, so please tell me if this is good...)`

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
	if (hasUpgrade('s', 11)) gain = new Decimal(1)
	if (hasUpgrade('s', 12)) gain = gain.times(2)
	if (hasUpgrade('s', 13)) gain = gain.times(upgradeEffect('s', 13))
	if (hasUpgrade('s', 21)) gain = gain.times(upgradeEffect('s', 21))
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}