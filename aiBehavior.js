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
	cardID = aiPickCard_1(playerID)

	return cardID;
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
	if(trickSuit != ""){
		for(var i=0; i<hands[playerID].length; i++){
			if(hands[playerID][i].suit == trickSuit || isLeftorRight(hands[playerID][i]) > 0){
				return hands[playerID][i].id;
			}
		}
	}
	return hands[playerID][0].id;
}
