///////////////////
// Basically some AI wrappers
///////////////////

function aiPickUp(player){
	//logic to decide which card to remove
	takeTrumpCandidate(hands[player][0]);
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
		trickSuit = card.suit;
	}
	trickPlayedCards[currentPlayer] = DECKDICT[cardID];
	removeFromHand(player, card);
	animPlayCard(player, cardID);
	trickPlayersPlayed++;
	OHMYGODCARD(player, card);
}
