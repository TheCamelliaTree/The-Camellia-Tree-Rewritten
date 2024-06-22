let modInfo = {
	name: "Ze Touhou Tree",
	id: "fujiwaranomokou",
	author: "Mokou and Kaguya",
	pointsName: "Mana Points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "The Camellia Tree",
	discordLink: "https://discord.gg/BEa67qjXa4",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 2400,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Reimu's Discovery of TMT",
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
	- Created ze tree <br>
	- Mokou and Kaguya are now having a fight`

let winText = `You defeat Mokou and Kaguya so much that they decided to end the tree at this point so that you don't get any stronger lol`

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
	let yyboost = player.fs.yypoints.max(1).log(10).plus(1)
	if (hasUpgrade('sc', 11)) gain = new Decimal(1)
	if (hasMilestone('bob', 0)) gain = new Decimal(1)
	if (hasUpgrade('sc', 24)) gain = new Decimal(2)
	if (hasUpgrade('fs', 25)) gain = new Decimal(12)
	if (hasUpgrade('sc', 12)) gain = gain.times(2)
	if (hasUpgrade('sc', 13)) gain = gain.times(upgradeEffect('sc', 13))
	if (hasUpgrade('sc', 23)) gain = gain.times(upgradeEffect('sc', 23))
	if (hasUpgrade('sc', 32)) gain = gain.pow(1.1)
	if (hasMilestone('fs', 0)) gain = gain.times(1.3)
	if (hasUpgrade('sc', 14)) gain = gain.times(4.444)
	if (hasMilestone('fs', 1)) gain = gain.times(1.5)
	if (hasUpgrade('sc', 34)) gain = gain.times(upgradeEffect('sc', 34))
	if (hasUpgrade('sc', 34)) gain = gain.pow(1.1)
	if (hasMilestone('fs', 2)) gain = gain.times(yyboost)
	if (hasUpgrade('sc', 42)) gain = gain.pow(1.1)
	if (hasUpgrade('sc', 44)) gain = gain.pow(1.09)
	if (hasUpgrade('fs', 14)) gain = gain.pow(1.5)
	if (hasUpgrade('fs', 15)) yyboost = player.fs.yypoints.max(1).log(8).plus(1)
	if (hasUpgrade('fs', 22)) gain = gain.pow(1.282)
	return gain
	
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [() => `You have <h2>${format(player.points)}</h2> Mana Points.`]

// Determines when the game "ends"
function isEndgame() {
	return hasMilestone('bob', 2)
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