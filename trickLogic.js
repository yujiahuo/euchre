//end of bidding and start of tricks
function startTricks(){
	console.log("starting tricks");
	trickNum = 1;
	nsTricksWOn = 0;
	weTricksWon = 0;
	currentPlayer = dealer;
	nextPlayer();
	isBidding = false;
	initNewTrick();
	animRemoveKitty();

	if(statMode){
		playTrick();
	}
	else{
		setTimeout(playTrick, 1000);
	}
}

//called before each trick
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

	if(alonePlayer !== players.NONE){
		if(currentPlayer === players.props[alonePlayer].partner){
			return;
		}
	}

	if(currentPlayer === players.SOUTH){
		enableActions();
		console.log("Your turn");
	}
	else{
		console.log(players.props[currentPlayer].name + " is playing");
		aiPickCard(currentPlayer);
		nextPlayer();
		setTimeout(playTrick, 1000);
	}
}

function endTrick(){
	var winner;

	console.log("trick ended");
	winner = getTrickWinner();
	currentPlayer = winner;
	if(winner===players.SOUTH || winner===players.NORTH) nsTricksWon += 1;
	if(winner===players.WEST || winner===players.EAST) weTricksWon += 1;

	console.log(winner + " wins the trick");

	animWinTrick(winner);
}

//returns winning player
function getTrickWinner(){
	var winner;
	var winningCard;

	winningCard = trickPlayedCards[players.SOUTH];
	winner = players.SOUTH;
	for(var i=1; i<4; i++){
		if(isGreater(winningCard,trickPlayedCards[i])){
			winner = i;
			winningCard = trickPlayedCards[i];
		}
	}
	return winner;
}

///////////////////
// Player playing actions
///////////////////

function pickCard(){
	var card;

	disableActions();
	card = DECKDICT[this.id];
	
	if(isBidding){
		takeTrumpCandidate(card);
		startTricks();
		return;
	}

	if(!isValidPlay(players.SOUTH, card)){
		enableActions();
		console.log("No. You can't play that. The suit is " + trickSuit);
		return;
	}

	OHMYGODCARD(players.SOUTH, card);

	if(trickPlayersPlayed === 0){
		trickSuit = card.suit;
	}
	trickPlayedCards[players.SOUTH] = card;
	removeFromHand(players.SOUTH, card);
	animPlayCard(players.SOUTH, card.id);
	trickPlayersPlayed++;
	nextPlayer();

	setTimeout(playTrick, 1000);
}