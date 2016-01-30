/******************************************************
/* Functions AIs have to implement
/* 
/* You may call functions from playerAPI.js
/* All other functions and vars are "private"
*******************************************************/

var hand;


//Called once hands have been dealt and the trump candidate is revealed
//Params: none
//Returns: none
function aiInit(){
	hand = myHand();
}

//Bidding round 1, choose whether to order up or pass
//Params: none
//Returns: bool
function aiOrderUp(){
	return false;
}

//Bidding round 1, if trump is ordered up to you, pick a card to discard
//Params: none
//Returns: card
function pickDiscard(){
	var hand;

	hand = myHand;
	return myHand[0];
}

//Bidding round 2, choose from the remaining suits or pass
//Params: none
//Returns: suit or nothing to pass
function aiChooseTrump(){
	return null;
}

//Called at any bidding round after you've determined trump
// Return true if going alone
//Params: none
//Returns: bool
function chooseGoAlone(){
	return false;
}

//Your turn to play a card
//Params: none
//Returns: card
function pickCard(){
	var hand;

	hand = myHand;
	for(var i=0; i<hand.length; i++){
		if(isValidPlay(player, hand[i])){
			return hand[i];
		}
	}
	//we will never reach this but just in case
	return hand[0];
}
