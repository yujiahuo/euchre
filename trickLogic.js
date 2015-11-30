//end of bidding and start of tricks
function startTricks(){
	console.log("starting tricks");
	trickNum = 1;
	trickPlayersPlayed = 0;
	trickSuit = "";
	trickPlayedCards = [];
	currentPlayerID = dealerID;
	nextPlayer();

	setTimeout(playTrick, 1000);
}

function playTrick(){
	var cardID;

	console.log("playing trick " + trickNum);
	if(trickPlayersPlayed > 3){
		if(trickNum < 5){
			console.log("trick ended");
			trickNum++;
			setTimeout(playTrick, 1000);
			return;
		}
		else{
			console.log("hand ended");
			endHand();
			newHand(0);
			return
		}
	}

	if(currentPlayerID == 0){
		console.log("Your turn");
	}
	else{
		console.log(currentPlayerID + " is playing");
		cardID = aiPickCard(currentPlayerID);
		console.log(currentPlayerID + " played " + cardID);
		if(trickPlayersPlayed == 0){
			trickSuit = cardID[0];
		}
		trickPlayedCards[currentPlayerID] = cardID;
		removeFromHand(currentPlayerID, cardID);
		animPlayCard(currentPlayerID, cardID);
		trickPlayersPlayed++;
		nextPlayer();
		setTimeout(playTrick, 1000);
	}
}

	if(trickSuit == ""){
		return true;
	}
	if(card.suit == trickSuit){
		return true;
	}
	if(card.suit == trump && isLeftOrRight(card) > 0){
		return true;
	}
	return false;
}

function endTrick(){

}

///////////////////
// Player playing actions
///////////////////

function pickCard(){

	if(trickPlayersPlayed == 0){
	}
	trickPlayersPlayed++;
	nextPlayer();

	setTimeout(playTrick, 1000);
}



