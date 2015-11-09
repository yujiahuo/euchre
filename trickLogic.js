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
			trickPlayersPlayed = 0;
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

function endTrick(){

}

///////////////////
// Player playing actions
///////////////////

function pickCard(){
	console.log("you played " + this.id);

	if(trickPlayersPlayed == 0){
		trickSuit = this.id[0];
	}
	trickPlayedCards[0] = this.id;
	animPlayCard(0, this.id);
	trickPlayersPlayed++;
	nextPlayer();

	setTimeout(playTrick, 1000);
}



