//end of bidding and start of tricks
function startTricks(){
	console.log("starting tricks");
	initNewTrick();
	trickNum = 1;
	nsTricksWOn = 0;
	weTricksWon = 0;
	currentPlayerID = dealerID;
	nextPlayer();

	if(statMode){
		playTrick();
	}
	else{
		setTimeout(playTrick, 1000);
	}
}

function initNewTrick(){
	trickPlayersPlayed = 0;
	trickSuit = "";
	trickPlayedCards = [];
}

//plays a single trick
function playTrick(){
	var cardID;

	console.log("playing trick " + trickNum);

	if(trickPlayersPlayed > 3){
		if(trickNum < 5){
			endTrick();
			initNewTrick();
			trickNum++;
			if(statMode){
				playTrick();
			}
			else{
				setTimeout(playTrick, 1000);
			}
			return;
		}
		else{
			console.log("hand ended");
			endTrick();
			endHand();
			if(statMode){
				newHand(0);
			}
			else{
				setTimeout(newHand, 1000, 0);
			}
			return
		}
	}

	if(currentPlayerID === 0){
		enableActions();
		console.log("Your turn");
	}
	else{
		console.log(currentPlayerID + " is playing");
		aiPickCard(currentPlayerID);
		nextPlayer();
		setTimeout(playTrick, 1000);
	}
}

function endTrick(){
	var winnerID;

	console.log("trick ended");
	winnerID = getTrickWinner();
	currentPlayerID = winnerID;
	if(winnerID===0 || winnerID===2) nsTricksWon += 1;
	if(winnerID===1 || winnerID===3) weTricksWon += 1;

	console.log(winnerID + " wins the trick");

	animWinTrick(winnerID);
}

//returns ID of winner
function getTrickWinner(){
	var winnerID;
	var winningCard;

	winningCard = trickPlayedCards[0];
	winnerID = 0;
	for(var i=1; i<4; i++){
		if(isGreater(winningCard,trickPlayedCards[i])){
			winnerID = i;
			winningCard = trickPlayedCards[i];
		}
	}
	return winnerID;
}

///////////////////
// Player playing actions
///////////////////

function pickCard(){
	var card;

	disableActions();
	card = DECKDICT[this.id];

	if(!isValidPlay(0, card)){
		enableActions();
		console.log("No. You can't play that. The suit is " + trickSuit);
		return;
	}

	console.log("you played " + card.id);

	if(trickPlayersPlayed === 0){
		trickSuit = card.id[0];
	}
	trickPlayedCards[0] = card;
	removeFromHand(0, card.id);
	animPlayCard(0, card.id);
	trickPlayersPlayed++;
	nextPlayer();

	setTimeout(playTrick, 1000);
}