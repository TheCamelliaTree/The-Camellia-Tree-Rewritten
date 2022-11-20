// ************ Themes ************
var themes = ["blackmagik", "uufo"]

function changeTheme() {
	document.body.classList = "theme-default " + "theme-" + options.theme;
}
function getThemeName() {
	return options.theme? options.theme : themes[0];
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
