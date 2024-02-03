let modInfo = {
	name: "Another AFK game that has so many stats that you wouldn't be able to complete it in 5 hours! Also this isn't a tree anymore and it's just two tabs full of text so is it really an AFK TMT mod or just an AFK game made with the TMT engine?",
	id: "aagthsmstywbatcii5hatiataaijttfotsiiraatmojaagmwtte",
	author: "Tsuki (original by Oleg)",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 999,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.8",
	name: "did I add too many stats this time",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1: Another AFK game that has so many stats that you wouldn't be able to complete it in 5 hours! Also this isn't a tree anymore and it's just two tabs full of text so is it really an AFK TMT mod or just an AFK game made with the TMT engine? Also WHY IS THIS UPDATE NAME SO LONG LIKE THIS IS JUST IT\'S RELEASE YOU DON\'T NEED A WHOLE ESSAY AS THE NAME HOLY SHIT</h3><br>
		- Added 12 stats!<br>
		- Completely died because of naming<br>
		- Why is this name so long<br>
		- Endgame: Get the 12th stat<br>
	<h3>v0.2: even more time to waste</h3><br>
		- Added 8 more stats.<br>
		- Endgame: 20th Stat<br>
	<h3>v0.3: 30 stats already? I'm surprised how you all want to sit for that long,</h3><br>
		- added 10 new stats... seriously this might get boring for you...<br>
		- Endgame: 30th Stat, idk how you will wait this one out, speaking of which, isn't this just a timewall simulator?<br>
	<h3>v0.4: 40 stats... 4% of the way of finishing this tree/mod or idk</h3><br>
		- added 10 new stats... again...<br>
		- Endgame: 40th Stat, seriously, should I really be doing this<br>
	<h3>v0.5: Inflation in the making...</h3><br>
		- Reduced currency scaling to 1.05x<br>
		- Added Anti-cheat, so you really can't cheat your way into making me push updates faster :3<br>
		- added 20 new stats this time, hopefully it's not gonna be reached by the time I wake up 2 days from now!<br>
		- Endgame: 60th Stat, should I be really putting the endgame when you all might know it from the update...<br>
	<h3>v0.6: Why...</h3><br>
		- added 20 new stats... again...<br>
		- Endgame: 80th stat, why is the stat name so long, REEK WHY SADFHJIOHIOAJOIEAJWFIFIOJWE<br>
	<h3>v0.6.0.1: fixes, really?</h3><br>
		- fixed a little error<br>
	<h3>v0.7: NEW LONGEST STAT!?</h3><br>
		- added 20 stats, the last one being so long that it's not gonna fit that screen<br>
		- Endgame: 100th Stat (FINAL UPDATE FOR THIS MONTH)<br>
	<h3>v0.8: did I add too many stats this time</h3><br>
		- added 81 stats, wait what-<br>
		- Endgame: 181st stat, I expect this within 5 days`

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
        gain = gain.mul(player.currencies[i][0].mul(i+1).min(115).max(1))
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
		[new Decimal(0),"Telescope",false,new Decimal(0)],//21
		[new Decimal(0),"CHAO",false,new Decimal(0)],//22
		[new Decimal(0),"Gear",false,new Decimal(0)],//23
		[new Decimal(0),"Power",false,new Decimal(0)],//24
		[new Decimal(0),"Blue",false,new Decimal(0)],//25
		[new Decimal(0),"Zenith",false,new Decimal(0)],//26
		[new Decimal(0),"Performance Point",false,new Decimal(0)],//27
		[new Decimal(0),"Soul",false,new Decimal(0)],//28
		[new Decimal(0),"Heart",false,new Decimal(0)],//29
		[new Decimal(0),"Parallel Universe Shifter",false,new Decimal(0)],//30
		[new Decimal(0),"SATELLITE",false,new Decimal(0)],//31
		[new Decimal(0),"Death",false,new Decimal(0)],//32
		[new Decimal(0),"Revival",false,new Decimal(0)],//33
		[new Decimal(0),"Hammer",false,new Decimal(0)],//34
		[new Decimal(0),"Circle",false,new Decimal(0)],//35
		[new Decimal(0),"Song",false,new Decimal(0)],//36
		[new Decimal(0),"Album",false,new Decimal(0)],//37
		[new Decimal(0),"Seed",false,new Decimal(0)],//38
		[new Decimal(0),"Tree",false,new Decimal(0)],//39
		[new Decimal(0),"ANTINEUTRINO WITCHCRAFT",false,new Decimal(0)],//40
		[new Decimal(0),"Proton",false,new Decimal(0)],//41
		[new Decimal(0),"Neutron",false,new Decimal(0)],//42
		[new Decimal(0),"Electron",false,new Decimal(0)],//43
		[new Decimal(0),"Office",false,new Decimal(0)],//44
		[new Decimal(0),"Episodes",false,new Decimal(0)],//45
		[new Decimal(0),"Washing Machine",false,new Decimal(0)],//46
		[new Decimal(0),"Project",false,new Decimal(0)],//47
		[new Decimal(0),"Sekai",false,new Decimal(0)],//48
		[new Decimal(0),"Kowloon Walled Citie",false,new Decimal(0)],//49
		[new Decimal(0),"Red Room",false,new Decimal(0)],//50
		[new Decimal(0),"Critical",false,new Decimal(0)],//51
		[new Decimal(0),"Rating",false,new Decimal(0)],//52
		[new Decimal(0),"Rewind",false,new Decimal(0)],//53
		[new Decimal(0),"Like",false,new Decimal(0)],//54
		[new Decimal(0),"Dislike",false,new Decimal(0)],//55
		[new Decimal(0),"Rocket",false,new Decimal(0)],//56
		[new Decimal(0),"Centimeter",false,new Decimal(0)],//57
		[new Decimal(0),"Cake",false,new Decimal(0)],//58
		[new Decimal(0),"Matter",false,new Decimal(0)],//59
		[new Decimal(0),"Antimatter Dimension",false,new Decimal(0)],//60		
		[new Decimal(0),"Duck",false,new Decimal(0)],//61
		[new Decimal(0),"Present",false,new Decimal(0)],//62
		[new Decimal(0),"Chicken",false,new Decimal(0)],//63
		[new Decimal(0),"Year",false,new Decimal(0)],//64
		[new Decimal(0),"Dinosaur",false,new Decimal(0)],//65
		[new Decimal(0),"Node",false,new Decimal(0)],//66
		[new Decimal(0),"Aincrad Floor",false,new Decimal(0)],//67
		[new Decimal(0),"Sauce",false,new Decimal(0)],//68
		[new Decimal(0),"Case",false,new Decimal(0)],//69 (nice)
		[new Decimal(0),"Season",false,new Decimal(0)],//70
		[new Decimal(0),"Error",false,new Decimal(0)],//71
		[new Decimal(0),"Full Recall",false,new Decimal(0)],//72
		[new Decimal(0),"Fast Forward",false,new Decimal(0)],//73
		[new Decimal(0),"Skip",false,new Decimal(0)],//74
		[new Decimal(0),"Bulletproof Vest",false,new Decimal(0)],//75
		[new Decimal(0),"Gambler",false,new Decimal(0)],//76
		[new Decimal(0),"Faceplant",false,new Decimal(0)],//77
		[new Decimal(0),"UNO Reverse",false,new Decimal(0)],//78
		[new Decimal(0),"Stack",false,new Decimal(0)],//79
		[new Decimal(0),"How many times The Everlasting Calamity Shifts The Time-Space Continuum On A Nanosecondal Basis because of ReeK being a lazy motherf***er trying to make the longest song title",false,new Decimal(0)],//80		
		[new Decimal(0),"Padoru",false,new Decimal(0)],//81
		[new Decimal(0),"Bell",false,new Decimal(0)],//82
		[new Decimal(0),"Miku",false,new Decimal(0)],//83
		[new Decimal(0),"Vocaloid",false,new Decimal(0)],//84
		[new Decimal(0),"Nebula Blast",false,new Decimal(0)],//85
		[new Decimal(0),"paraxysm",false,new Decimal(0)],//86
		[new Decimal(0),"[diffraction]",false,new Decimal(0)],//87
		[new Decimal(0),"INSANE INFLAME",false,new Decimal(0)],//88
		[new Decimal(0),"Blackmagik Blazing",false,new Decimal(0)],//89 (nice)
		[new Decimal(0),"Xeroa",false,new Decimal(0)],//90
		[new Decimal(0),"Dyscontrolled Galaxie",false,new Decimal(0)],//91
		[new Decimal(0),"GALAXY BURST",false,new Decimal(0)],//92
		[new Decimal(0),"NITROUS CANNON",false,new Decimal(0)],//93
		[new Decimal(0),"Atomosphere",false,new Decimal(0)],//94
		[new Decimal(0),"crystal",false,new Decimal(0)],//95
		[new Decimal(0),"Light",false,new Decimal(0)],//96
		[new Decimal(0),"Sketche",false,new Decimal(0)],//97
		[new Decimal(0),"USAO",false,new Decimal(0)],//98
		[new Decimal(0),"Kobaryo",false,new Decimal(0)],//99
		[new Decimal(0),"The Amount of Tentacular Aliens' Extraterrestrial Jungle Dance Music In a Super-Ultra-Gigangtic-Mega U.F.O (it may be U.U.F.O.) flying over Illinois st. Destroying The Forest With A Would Be Machinegun Psystyle (And more genre switches) And A Blue-Eyed Skeleton With A Blue Jacket (It May Be Sans) Cycling through Baseballs And Base-Drops Entering The Jungle And Getting Fried From Furry Cannon From A Muzzle Facing (Long muzzled version) from Wacca Causing The May-be U.U.F.O Facing Wolves Thinking They Are Standing Towards Enemies, (From Lanota's not so hidden boss), And WYSI (When You See It) A New Challenger Approaches. Getting More Than 727 PP (M1LL10N PP) Compute It With Some Devilish Alchaolic Gears (or something im not sure) Getting GHOST-ed, (With GHOUL-ish Mixes) After The SLIME INCIDENT Trying To Purge My Existence From This World While Looking For Edge On Ground at AREA 52 Injecting The CICADA 3302 Villain Virus Liquating The Would Be Flamewall To Give Newspapers For Magicians In NIGHTMARE CITY While Having A Paroxysm With The Would Be U.U.F.O. Screaming The Immortal Scream In The Red Room While Spinning Eternally Exiting This Earths Atomosphere and Planet Shaping The Would Be Earths Atomosphere With A Nacreous Snowmelt and Lighting it up With a Crystallized KillerToy Flying Wit Me having Terabyte Connection That is Asking Why Do You Hate Me While Under Construxion With ΩΩPARTS While Inputting a Bad Access (From a Moe Maid) Into Their Spine While Creating a Nasty Nasty Spell That Blows Up a Nuclear Star Creating a Reality Distortion While Friending Nanahira On Bassbook Lol While Raising The BPM to 2021 While In The Bermuda Triangle While Creating another Nuclear Star Called #1f1e33 (#00102g Long Colored Version) While Trying To Break The Silence And Dance With Silence While Dealing With Completeness Under Incompleteness In A Blastix Riotz Asking R U Still xxxx? While Feeling Seasickness Going To The First Town Of This Journey While Dancing On The Mars And Trying To Find Proof Of A Hero (from a Monster Hunter) While Slicing Toxic Violet Cubes In Beat Saber While Volt Tackling a Galaxy Collision That Is A Dyscontrolled Galaxy Burst That Is Close To A Galaxy Collapse Leaving Scattered Faith Crosse",false,new Decimal(0)],//100
		[new Decimal(0),"Cyaegha",false,new Decimal(0)], //101
        [new Decimal(0),"Cosmica",false,new Decimal(0)],//102
		[new Decimal(0),"Singularitie",false,new Decimal(0)],//103
		[new Decimal(0),"Memory Forest",false,new Decimal(0)],//104
		[new Decimal(0),"Stronghold",false,new Decimal(0)],//105
		[new Decimal(0),"Silent Rushe",false,new Decimal(0)],//106
		[new Decimal(0),"Moonheart",false,new Decimal(0)],//107
		[new Decimal(0),"Romance War",false,new Decimal(0)],//108
		[new Decimal(0),"Blossom",false,new Decimal(0)],//109
		[new Decimal(0),"Party Vinyl",false,new Decimal(0)],//110
		[new Decimal(0),"Flashback",false,new Decimal(0)],//111
		[new Decimal(0),"Callima Karma",false,new Decimal(0)],//112
		[new Decimal(0),"Lost",false,new Decimal(0)],//113
		[new Decimal(0),"Loveless Dresse",false,new Decimal(0)],//114
		[new Decimal(0),"Defection",false,new Decimal(0)],//115
		[new Decimal(0),"Arcahv",false,new Decimal(0)],//116
		[new Decimal(0),"Antagonism",false,new Decimal(0)],//117
		[new Decimal(0),"Equilibrium",false,new Decimal(0)],//118
		[new Decimal(0),"BLRINK",false,new Decimal(0)],//119
		[new Decimal(0),"Vindication",false,new Decimal(0)],//120
		[new Decimal(0),"Particle Art",false,new Decimal(0)],//121
		[new Decimal(0),"The Message",false,new Decimal(0)],//122
		[new Decimal(0),"Halcyon",false,new Decimal(0)],//123
		[new Decimal(0),"Ether Strike",false,new Decimal(0)],//124
		[new Decimal(0),"conflict",false,new Decimal(0)],//125
		[new Decimal(0),"SOUNDWiTCH",false,new Decimal(0)],//126
		[new Decimal(0),"Iconoclast",false,new Decimal(0)],//127
		[new Decimal(0),"Solitary Dream",false,new Decimal(0)],//128
		[new Decimal(0),"Sheriruth",false,new Decimal(0)],//129
		[new Decimal(0),"Lumia",false,new Decimal(0)],//130
		[new Decimal(0),"G e n g a o z o ",false,new Decimal(0)],//131
		[new Decimal(0),"False Embellishment",false,new Decimal(0)],//132
		[new Decimal(0),"Turbocharger",false,new Decimal(0)],//133
		[new Decimal(0),"blue comet",false,new Decimal(0)],//134
		[new Decimal(0),"HIVEMIND",false,new Decimal(0)],//135
		[new Decimal(0),"Vandalism",false,new Decimal(0)],//136
		[new Decimal(0),"Glow",false,new Decimal(0)],//137
		[new Decimal(0),"Purple Verse",false,new Decimal(0)],//138
		[new Decimal(0),"Bamboo",false,new Decimal(0)],//139
		[new Decimal(0),"Faint Light",false,new Decimal(0)],//140
		[new Decimal(0),"GIMMICK",false,new Decimal(0)],//141
		[new Decimal(0),"Lawless Point",false,new Decimal(0)],//142
		[new Decimal(0),"To The Furthest Dream",false,new Decimal(0)],//143
		[new Decimal(0),"Manic Jeer",false,new Decimal(0)],//144
		[new Decimal(0),"PRIMITIVE LIGHT",false,new Decimal(0)],//145
		[new Decimal(0),"Crimson Throne",false,new Decimal(0)],//146
		[new Decimal(0),"Capella",false,new Decimal(0)],//147
		[new Decimal(0),"PUPA",false,new Decimal(0)],//148
		[new Decimal(0),"INTERNET OVERDOSE",false,new Decimal(0)],//149
		[new Decimal(0),"BUCHiGiRE Berserker",false,new Decimal(0)],//150
		[new Decimal(0),"Scarlet Cage",false,new Decimal(0)],//151
		[new Decimal(0),"Altale",false,new Decimal(0)],//152
		[new Decimal(0),"Dreadnought",false,new Decimal(0)],//153
		[new Decimal(0),"Phantasia",false,new Decimal(0)],//154
		[new Decimal(0),"Filament",false,new Decimal(0)],//155
		[new Decimal(0),"Einherjar Joker",false,new Decimal(0)],//156
		[new Decimal(0),"IZANA",false,new Decimal(0)],//157
		[new Decimal(0),"Shades of Light in the Transcendent Realm",false,new Decimal(0)],//158
		[new Decimal(0),"Grimheart",false,new Decimal(0)],//159
		[new Decimal(0),"Lost Desire",false,new Decimal(0)],//160		
		[new Decimal(0),"Arghena",false,new Decimal(0)],//161
		[new Decimal(0),"Bookmaker",false,new Decimal(0)],//162
		[new Decimal(0),"REKKA RESONANCE",false,new Decimal(0)],//163
		[new Decimal(0),"SAIKYO STRONGER",false,new Decimal(0)],//164
		[new Decimal(0),"dropdeath",false,new Decimal(0)],//165
		[new Decimal(0),"Malicious Mischance",false,new Decimal(0)],//166
		[new Decimal(0),"Aegleseeker",false,new Decimal(0)],//167
		[new Decimal(0),"Galaxy Friend",false,new Decimal(0)],//168
		[new Decimal(0),"Tempestissimo",false,new Decimal(0)],//169
		[new Decimal(0),"Axium Crise",false,new Decimal(0)],//170
		[new Decimal(0),"Fracture Ray",false,new Decimal(0)],//171
		[new Decimal(0),"Grievous Ladie",false,new Decimal(0)],//172
		[new Decimal(0),"PRAGMATISM -RESURRECTION-",false,new Decimal(0)],//173
		[new Decimal(0),"Dantalion",false,new Decimal(0)],//174
		[new Decimal(0),"AttraqtiA",false,new Decimal(0)],//175
		[new Decimal(0),"Pentiment",false,new Decimal(0)],//176
		[new Decimal(0),"Infinite Strife,",false,new Decimal(0)],//177
		[new Decimal(0),"World Ender",false,new Decimal(0)],//178
		[new Decimal(0),"Testify",false,new Decimal(0)],//179
		[new Decimal(0),"Arcana Eden",false,new Decimal(0)],//180		
		[new Decimal(0),"#1f1e33",false,new Decimal(0)],//181
    ],
}}

var backgroundStyle = {

}

// Display extra things at the top of the page
var displayThings = [() => `${player.devSpeed>1 ? `Oi... Why are you trying to cheat... Set your Dev Speed back to 1 or else you won't be able to progress! Also, Point cheating isn't available for you to do either >:3` : ''}`
]

// Determines when the game "ends"
function isEndgame() {
	return false
}

function maxTickLength() {
	return(7270) // Default is 1 hour which is just arbitrarily large
}

function fixOldSave(oldVersion){
}