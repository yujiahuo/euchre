function newGame(){
	document.getElementById("menu").style.display = "none";
	game = new Game();
	game.start();
}

function settings(){
	disappearMenu("start");
	appearMenu("settings");
}

function back(){
	disappearMenu("settings");
	disappearMenu("howTo");
	appearMenu("start");
}

function howToPlay(){
	disappearMenu("start");
	appearMenu("howTo");
}

function appearMenu(menuName){
	document.getElementById("menu").classList.add(menuName+"Active");
	setTimeout(toggleOpacity, 100, menuName+"MenuItems", 1);
	toggleDisplay(menuName+"MenuItems", 1);
}

function disappearMenu(menuName){
	document.getElementById("menu").classList.remove(menuName+"Active");
	document.getElementById(menuName+"MenuItems").style.opacity = "0";
	setTimeout(toggleDisplay, 300, menuName+"MenuItems", 0);
}

function toggleDisplay(elemID, on){
	if(on){
		document.getElementById(elemID).style.display = "inline";
	}
	else{
		document.getElementById(elemID).style.display = "none";
	}
}

function toggleOpacity(elemID, on){
	if(on){
		document.getElementById(elemID).style.opacity = "1";
	}
	else{
		document.getElementById(elemID).style.opacity = "0";
	}
}