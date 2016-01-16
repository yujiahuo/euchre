function newGame(){
	//place to play with settings
	allFaceUp = false;
	////////
	initNewGame();
	newHand(0);
}

//Just initializes all the variables
function initNewGame(){
	animShowText("NEW GAME");

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

function updateScore(){
	if(nsTricksWon > weTricksWon){
		//got all tricks or euchred other team
		if(nsTricksWon===5 || makers==="we"){
			nsScore += 2;
		}
		else{
			nsScore += 1;
		}
		animShowScore();
		if(nsScore >= 10) endGame(true);
	}
	else if(weTricksWon > nsTricksWon){
		//got all tricks or euchred other team
		if(weTricksWon===5 || makers==="ns"){
			weScore += 2;
		}
		else{
			weScore += 1;
		}
		animShowScore();
		if(weScore >= 10) endGame(false);
	}
	else{
		console.log("something went horribly wrong with scoring");
	}
}

function endGame(didIWinIHopeIWon){
	if(didIWinIHopeIWon){
		animShowText("WOW YOU'RE SO GREAT YOU WON WOW.jpg");
	}
	else{
		animShowText("HAHA YOU SUCK. DOT JAY PEG");
	}

	initNewGame();
}