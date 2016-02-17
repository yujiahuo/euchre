/******************************************************
/* Functions AIs have to implement
/* 
/* You may call functions from playerAPI.js
/* All other functions and vars are "private"
*******************************************************/

function DecentAI(){
	//Called once hands have been dealt and the trump candidate is revealed
	//Params: none
	//Returns: none
	this.init = function(){}

	//Bidding round 1, choose whether to order up or pass
	//Params: none
	//Returns: bool
	this.chooseOrderUp = function(){}

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