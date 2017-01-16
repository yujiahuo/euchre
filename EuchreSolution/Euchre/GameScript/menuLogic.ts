/**********************************
* What does this button do?
***********************************/

function newGame(): void {
	document.getElementById("menu").style.display = "none";
	game = new Game();
	game.start();
}

function settings(): void {
	disappearMenu("start");
	appearMenu("settings");
}

function back(): void {
	disappearMenu("settings");
	disappearMenu("howTo");
	appearMenu("start");
}

//TODO: implement
function backFromGame(): void {
	//document.getElementById("cardsContainer").innerHTML = "";
}

function howToPlay(): void {
	disappearMenu("start");
	appearMenu("howTo");
}

/**********************************
* Display utilities
***********************************/
function appearMenu(menuName: string): void {
	document.getElementById("menu").classList.add(menuName + "Active");
	setTimeout(toggleOpacity, 100, menuName + "MenuItems", 1);
	toggleDisplay(menuName + "MenuItems", true);
}

function disappearMenu(menuName: string): void {
	document.getElementById("menu").classList.remove(menuName + "Active");
	document.getElementById(menuName + "MenuItems").style.opacity = "0";
	setTimeout(toggleDisplay, 300, menuName + "MenuItems", 0);
}

function toggleDisplay(elemID: string, on: boolean): void {
	if (on) {
		document.getElementById(elemID).style.display = "inline";
	}
	else {
		document.getElementById(elemID).style.display = "none";
	}
}

function toggleOpacity(elemID: string, on: boolean): void {
	if (on) {
		document.getElementById(elemID).style.opacity = "1";
	}
	else {
		document.getElementById(elemID).style.opacity = "0";
	}
}