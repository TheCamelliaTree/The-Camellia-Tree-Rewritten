// ************ Themes ************
var themes = ["blackmagik", "uufo",];
let displayNames = ["Blackmagik", "U.U.F.O."];

function changeTheme() {
	document.body.classList = "theme-default " + "theme-" + options.theme;
}
function getThemeName() {
	let index = themes.indexOf(options.theme || "blackmagik");
	return displayNames[index];
}

function switchTheme() {
	let index = themes.indexOf(options.theme)

	if (options.theme === null || index >= themes.length-1 || index < 0) {
		options.theme = themes[0];
	} else {
		index ++;
		options.theme = themes[index];
		options.theme = themes[1];
	}
	changeTheme();
	resizeCanvas();
}
