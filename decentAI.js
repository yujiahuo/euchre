/******************************************************
/* Functions AIs have to implement
/*
/* You may call functions from playerAPI.js
*******************************************************/

var hand;
var handStrength;

function DecentAI(){
	//Called once hands have been dealt and the trump candidate is revealed
	//Params: none
	//Returns: none
	this.init = function(){
		hand = game.myHand();
	}

	//Bidding round 1, choose whether to order up or pass
	//Params: none
	//Returns: bool
	this.chooseOrderUp = function(){
		calculateHandStrength(game.getTrumpCandidate().suit);
		//if(handStrength > )
	}

	//Bidding round 1, if trump is ordered up to you, pick a card to discard
	//Params: none
	//Returns: card
	this.pickDiscard = function(){}

	//Bidding round 2, choose from the remaining suits or pass
	//Params: none
	//Returns: suit or null
	this.pickTrump = function(){}

	//Called at any bidding round after you've determined trump
	// Return true if going alone
	//Params: none
	//Returns: bool
	this.chooseGoAlone = function(){}

	//Your turn to play a card
	//Params: none
	//Returns: card
	this.pickCard = function(){}
}

// 100+ ---- bid
// 1
function calculateHandStrength(trumpSuit){
	var numTrump;
	var numSuits;
	var points;
	var strength;

	strength = 0;

	//number of trump you're holding is worth exponentially
	//increasing number of points
	numTrump = numCardsOfSuit(trumpSuit);
	strength += numTrump * 20;

	//more suits bad
	numSuits = countSuits();
	strength -= (numSuits - 1) * 5

	//add points for value of cards
	for(var i=0; i<hand.length; i++){
		points = hand[i].rank;
		if(isTrump(hand[i])){
			points *= 2;
		}
		strength += points
	}

	return strength;
}



