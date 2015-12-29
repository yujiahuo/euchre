///////////////////
// AI actions
///////////////////

function aiDiscard(){
	//logic to decide which card to remove
	removeFromHand(dealerID, 1);
}

function aiDecideOrderUp(){
	//keeping passing code here as a placeholder for now
	console.log("Player " + currentPlayerID + " has passed");
	playersBid += 1;
	nextPlayer();
	setTimeout(doBidding, 1000);
}

function aiPickCard(playerID){
	var cardID;

	//decide what difficulty AI to use
	//if(player = "North")
	cardID = aiPickCard_1(playerID);

	if(trickPlayersPlayed === 0){
		trickSuit = cardID[0];
	}
	trickPlayedCards[currentPlayerID] = DECKDICT[cardID];
	removeFromHand(playerID, cardID);
	animPlayCard(playerID, cardID);
	trickPlayersPlayed++;
	console.log(playerID + " played " + cardID);
}

//
function aiTakeOrderedUp(playerID){
	return aiTakeOrderedUp_1(playerID);
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
function aiPickCard_1(playerID){
	for(var i=0; i<hands[playerID].length; i++){
		if(isValidPlay(playerID, hands[playerID][i])){
			return hands[playerID][i].id;
		}
	}
	return hands[playerID][0].id;
}

function aiTakeOrderedUp_1(playerID){
	return hands[playerID][0].id;
}
