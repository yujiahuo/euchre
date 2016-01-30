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

/******************************************************
/* Functions AIs have to implement
/* 
/* You may call functions from playerAPI.js
/* All other functions and vars are "private"
*******************************************************/

function idiotAI(){
	//Called once hands have been dealt and the trump candidate is revealed
	//Params: none
	//Returns: none
	this.function aiInit(){}

	//Bidding round 1, choose whether to order up or pass
	//Params: none
	//Returns: bool
	this.function aiOrderUp(){
		return false;
	}

	//Bidding round 1, if trump is ordered up to you, pick a card to discard
	//Params: none
	//Returns: card
	this.function pickDiscard(){
		var hand;

		hand = myHand();
		return myHand[0];
	}

	//Bidding round 2, choose from the remaining suits or pass
	//Params: none
	//Returns: suit
	this.function aiChooseTrump(){
		return null;
	}

	//Called at any bidding round after you've determined trump
	// Return true if going alone
	//Params: none
	//Returns: bool
	this.function chooseGoAlone(){
		return false;
	}

	//Your turn to play a card
	//Params: none
	//Returns: card
	this.function pickCard(){
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
}
