let modInfo = {
	name: "vivid/stasis tree",
	id: "omgallisonandsaturdayarelesbians",
	author: "Saturday, Allison, Kotomi, Eri, Chiyo, Dawn, and THE WORLDKEEPER",
	pointsName: "Points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "The Camellia Tree",
	discordLink: "https://discord.gg/BEa67qjXa4",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 2400,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Another Virtual World?",
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
	- Created the Tree <br>
	- uhhhh, what is going on in the room right now`

let winText = `Saturday's wallet was full to the point where Allison and her went-- never mind we're ending it here`

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
	if (hasUpgrade('b', 11)) gain = new Decimal(1)
	if (hasUpgrade('b', 12)) gain = gain.times(2)
	if (hasUpgrade('b', 13)) gain = gain.times(upgradeEffect('b', 13))
	return gain
	
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [() => `You have <h2>${format(player.points)}</h2> Points in your Wallet.`]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte("1e3333")
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