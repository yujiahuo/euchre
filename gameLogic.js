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
		//gain at least one point
		nsScore++;
		if(nsTricksWon === 5){
			//at least one more for having all the tricks
			nsScore++;
			if(alonePlayer === players.SOUTH || alonePlayer === players.NORTH){
				nsScore += 2;
			}
		}
		if(makers === 'we'){
			nsScore++;
			//defend alone same logic as alone player
		}

		animShowScore();
		if(nsScore >= 10) endGame(true);
	}
	else if(weTricksWon > nsTricksWon){
		//gain at least one point
		weScore++;
		if(weTricksWon === 5){
			//at least one more for having all the tricks
			weScore++;
			if(alonePlayer === players.WEST || alonePlayer === players.EAST){
				weScore += 2;
			}
		}
		if(makers === 'ns'){
			weScore++;
			//defend alone same logic as alone player
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
