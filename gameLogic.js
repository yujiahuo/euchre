function newGame(){
	document.getElementById("menu").style.display = "none";
	game = new Game();
	game.start();
}

function settings(){
	disappearMenu("start");
	appearMenu("settings");
}

function howToPlay(){
	document.getElementById("menu").classList.remove("startMenu");
	document.getElementById("menu").classList.add("howToMenu");
	document.getElementById("startMenuItems").style.opacity = "0";
}

function appearMenu(menuName){
	document.getElementById("menu").classList.add(menuName+"Active");
	document.getElementById(menuName+"MenuItems").style.opacity = "1";
	toggleMenu(menuName+"MenuItems", 1);
}

function disappearMenu(menuName){
	document.getElementById("menu").classList.remove(menuName+"Active");
	document.getElementById(menuName+"MenuItems").style.opacity = "0";
	setTimeout(toggleMenu, 300, menuName+"MenuItems", 0);
}

function toggleMenu(elemID, on){
	if(on){
		document.getElementById(elemID).style.display = "inline";
	}
	else{
		document.getElementById(elemID).style.display = "none";
	}
}