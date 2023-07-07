// ************ Themes ************
var themes = {
	blackmagik: "BLACKMAGIK", 
	uufo: "U.U.F.O.",
};

function changeTheme() {
	document.body.classList = "theme-default " + "theme-" + options.theme;
}
function getThemeName() {
	return themes[options.theme || "blackmagik"];
}

function switchTheme() {
	let list = Object.keys(themes);
	let index = list.indexOf(options.theme);

	options.theme = list[(index + 1) % list.length];

	changeTheme();
	resizeCanvas();
}

// ************ Notations ************
var notations = {
	scientific: "SCIENTIFIC", 
	engineering: "ENGINEERING", 
	standard: "STANDARD", 
	letters: "LETTERS", 
};

function getNotationName() {
	return notations[options.notation || "scientific"];
}

function switchNotation() {
	let list = Object.keys(notations);
	let index = list.indexOf(options.notation);

	options.notation = list[(index + 1) % list.length];
}
