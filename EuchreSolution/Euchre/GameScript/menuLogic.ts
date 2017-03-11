/**********************************
* What does this button do?
***********************************/

function newGame(): void {
	let menu = document.getElementById("menu");
	if (menu) {
		menu.style.display = "none";
	}
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
	let menu = document.getElementById("menu");
	if (menu) {
		menu.classList.add(menuName + "Active");
	}
	setTimeout(toggleOpacity, 100, menuName + "MenuItems", 1);
	toggleDisplay(menuName + "MenuItems", true);
}

function disappearMenu(menuName: string): void {
	let menu = document.getElementById("menu");
	if (menu) {
		menu.classList.remove(menuName + "Active");
	}
	let menuItems = document.getElementById(menuName + "MenuItems");
	if (menuItems) {
		menuItems.style.opacity = "0";
	}
	setTimeout(toggleDisplay, 300, menuName + "MenuItems", 0);
}

function toggleDisplay(elemID: string, on: boolean): void {
	let element = document.getElementById(elemID);
	if (!element) {
		return;
	}
	if (on) {
		element.style.display = "inline";
	}
	else {
		element.style.display = "none";
	}
}

function toggleOpacity(elemID: string, on: boolean): void {
	let element = document.getElementById(elemID);
	if (!element) {
		return;
	}
	if (on) {
		element.style.opacity = "1";
	}
	else {
		element.style.opacity = "0";
	}
}