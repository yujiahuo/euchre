function newGame(){
	//place to play with settings
	allFaceUp = false;
	////////
	initNewGame();
	newHand(0);
}

//Just initializes all the variables
function initNewGame(){
	nsScore = 0;
	weScore = 0;
	zIndex = 2;

	handNum = 0;

	trickplayersPlayed = 0;
	trickNum = 1;
	trickSuit = "";
	trickPlayedCards = new Array(4);
	currentPlayer = players.NONE;

	disableActions();
}

function nextPlayer(){
	currentPlayer = (currentPlayer+1)%4;
}