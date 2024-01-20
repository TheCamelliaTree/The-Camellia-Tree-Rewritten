let modInfo = {
	name: "Another AFK game that has so many stats that you wouldn't be able to complete it in 5 hours! Also this isn't a tree anymore and it's just two tabs full of text so is it really an AFK TMT mod or just an AFK game made with the TMT engine?",
	id: "aagthsmstywbatcii5hatiataaijttfotsiiraatmojaagmwtte",
	author: "Tsuki (original by Oleg)",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Another AFK game that has so many stats that you wouldn't be able to complete it in 5 hours! Also this isn't a tree anymore and it's just two tabs full of text so is it really an AFK TMT mod or just an AFK game made with the TMT engine? Also WHY IS THIS UPDATE NAME SO LONG LIKE THIS IS JUST IT'S RELEASE YOU DON'T NEED A WHOLE ESSAY AS THE NAME HOLY SHIT",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1: Another AFK game that has so many stats that you wouldn't be able to complete it in 5 hours! Also this isn't a tree anymore and it's just two tabs full of text so is it really an AFK TMT mod or just an AFK game made with the TMT engine? Also WHY IS THIS UPDATE NAME SO LONG LIKE THIS IS JUST IT\'S RELEASE YOU DON\'T NEED A WHOLE ESSAY AS THE NAME HOLY SHIT</h3><br>
		- Added 12 stats!<br>
		- Completely died because of naming<br>
		- Why is this name so long<br>
		- Endgame: Get the 12th stat`

let winText = `how the fuck did you complete this tree, it was suppose to take 1000 hours not 1000 seconds`

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

	let gain = new Decimal(1)
    for(i=0;i<player.currencies.length;i++){
        gain = gain.mul(player.currencies[i][0].mul(i+1).max(1))
    }
    return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
    currencies: [
        [new Decimal(0),"Multi",true,new Decimal(0)], //1
        [new Decimal(0),"Rebirth",false,new Decimal(0)],//2
		[new Decimal(0),"Reincarnation",false,new Decimal(0)],//3
		[new Decimal(0),"Ascension(s) to the Heaven",false,new Decimal(0)],//4
		[new Decimal(0),"Kill",false,new Decimal(0)],//5
		[new Decimal(0),"Metal",false,new Decimal(0)],//6
		[new Decimal(0),"xi",false,new Decimal(0)],//7
		[new Decimal(0),"7eaF",false,new Decimal(0)],//8
		[new Decimal(0),"Camellia",false,new Decimal(0)],//9
		[new Decimal(0),"Snipe",false,new Decimal(0)],//10
		[new Decimal(0),"Doppelganger",false,new Decimal(0)],//11
		[new Decimal(0),"TMT Mod",false,new Decimal(0)],//12
		[new Decimal(0),"Member",false,new Decimal(0)],//13
		[new Decimal(0),"Booster",false,new Decimal(0)],//14
		[new Decimal(0),"Bone",false,new Decimal(0)],//15
		[new Decimal(0),"Gloom",false,new Decimal(0)],//16
		[new Decimal(0),"Meme",false,new Decimal(0)],//17
		[new Decimal(0),"Tan Tan",false,new Decimal(0)],//18
		[new Decimal(0),"V",false,new Decimal(0)],//19
		[new Decimal(0),"Ⅱ́̕",false,new Decimal(0)],//20
    ],
}}

var backgroundStyle = {

}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}

function maxTickLength() {
	return(727) // Default is 1 hour which is just arbitrarily large
}