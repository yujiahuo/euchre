///////////////////
// AI actions
///////////////////

function aiPickUp(player){
	//logic to decide which card to remove
	takeTrumpCandidate(player, hands[player][0]);
}

function aiDecideOrderUp(){
	//keeping passing code here as a placeholder for now
	console.log("Player " + currentPlayer + " has passed");
	playersBid += 1;
	nextPlayer();
	setTimeout(doBidding, 1000);
}

function aiPickCard(player){
	var card;
	var cardID;

	//decide what difficulty AI to use
	card = aiPickCard_1(player);
	cardID = card.id

	if(trickPlayersPlayed === 0){
		trickSuit = cardID[0];
	}
	trickPlayedCards[currentPlayer] = DECKDICT[cardID];
	removeFromHand(player, card);
	animPlayCard(player, cardID);
	trickPlayersPlayed++;
	console.log(player + " played " + cardID);
}

//////////////////////////////
// Genius AI decision making
//////////////////////////////

function aiPickCard_3(){

}

/////////////////////////////////
// Mediocre AI decision making
/////////////////////////////////

function aiPickCard_2(){

}

////////////////////////////////////////
// Absolute dipshit AI decision making
////////////////////////////////////////

//LA DEE DA PLAY THE FIRST CARD THAT FOLLOWS SUIT
//returns ID of the card picked
function aiPickCard_1(player){
	for(var i=0; i<hands[player].length; i++){
		if(isValidPlay(player, hands[player][i])){
			return hands[player][i];
		}
	}
	return hands[player][0];
}

function aiTakeOrderedUp_1(player){
	return hands[player][0];
}
