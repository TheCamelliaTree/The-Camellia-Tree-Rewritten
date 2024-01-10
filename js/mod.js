let modInfo = {
	name: "The Camellia Tree",
	id: "Camellia",
	author: "Not Cametek (Halloweeb#4371 collabing with Flustix#5433 (foreshadowing something))",
	pointsName: "notes",
	modFiles: ["layers.js", "tree.js"],

	discordName: "The Camellia Tree",
	discordLink: "https://discord.gg/BEa67qjXa4",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 2400,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.3.1",
	name: "Potential Block in Japan",
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
	<h3>v0.3.1</h3><br>
		- Added a layer.<br>
		- Added challenges to the new layer (omg camellia song reference if I didn't express that already (thank you GrievousKnight#8249 for the nerf)).<br>
		- Added songs to the new layer (thx to Icecreamdude's "Incremental God Tree" code, do play the tree, it's good).<br>
		- Added a song softcap due to inflation reasons.<br>
		- Paroxysm is now finished.<br>
		- Added some new layer upgrades.<br>
		- Added the changelog format.<br>
		- Fixed some bugs and grammar (thanks to some of you guys for finding them).<br>
		- Endgame is unlocking Sound Voltex Tab.<br>
	<h3>v0.2</h3><br>
		- Added a new layer. (Members)<br>
		- Added 2 Song Upgrades and 4 Paroxysm Upgrades and Milestones.<br>
		- Fixed a softlocking problem.<br>
		- Added 2 Paroxysm Buyables.<br>
		- Added Endgame under Points.<br>
		- Endgame is 1 Member.<br>
	<h3>v0.1</h3><br>
		- Added Songs, Albums, and Paroxysm Layer (not implemented).<br>
		- Endgame is Paroxysm Layer.`

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
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	if (inChallenge('p', 11)) gain = new Decimal(1)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [() => `Current Endgame: Sound Voltex Tab unlocked.<br> ${inChallenge('b', 12) ? ` T1M3 UN!17 KU23HA C0N5UM35 A77: ${format(player.b.ktime)}s` : ''}<br><h1> ${inChallenge('b', 12) && player.b.time>88.8 && player.b.time<100.5 ? ` KU23HA W177 C0N5UM3 A77.` : ''}${inChallenge('b', 12) && player.b.time>100.5 && player.b.time<111.75 ? ` 1! 15 100 7A13.` : ''}<h1>${inChallenge('b', 12) && player.b.time>111.75 ? ` N0W P32!5H!!!` : ''}`]

// Determines when the game "ends"
function isEndgame() {
	return hasMilestone('b', 9)
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