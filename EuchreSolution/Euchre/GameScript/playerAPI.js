/*******************************
* Get game properties
********************************/

function myHand() {
    return game.myHand();
}

function getTrickPlayedCards() {
    return game.getTrickPlayedCards();
}

function leftOfPlayer(player) {
    return (player + 1) % 4;
}

//returns true if card2 is greater than card1 for this hand
//if a card is undefined, the other card wins
//if both cards are undefined, return false
function isGreater(card1, card2){
	if(card1 === undefined){
		return true;
	}
	else if(card2 === undefined){
		return false;
	}

	if(isTrump(card1)){
		if(!isTrump(card2)){
			return false;
		}
	}
	else if(isTrump(card2)){
		return true;
	}

	if(followsSuit(card1)){
		if(!followsSuit(card2)){
			return false;
		}
	}
	else if(followsSuit(card2)){
		return true;
	}

	//both/neither are trump and both/neither follows suit
	return (card2.rank > card1.rank);
}

function isValidPlay(card){
	if(card == null){ //double equal will also find undefined
		return false;
	}
	if(!hasSuit(game.getTrickSuit())){
		return true;
	}
	if(followsSuit(card)){
		return true;
	}
	return false;
}

function isTrump(card){
	return card.suit === game.getTrump();
}

function followsSuit(card){
	var trickSuit;

	trickSuit = game.getTrickSuit();
	if(trickSuit === ""){
		return true;
	}
	if(card.suit === trickSuit){
		return true;
	}
	return false;
}

//can be called about the current player
function hasSuit(suit){
	var hand = myHand();
	for(var i=0; i<hand.length; i++){
		if(hand[i].suit === suit) return true;
	}
	return false;
}

/* Returns whether or not it is currently legal for the given player to
   order up a given suit.
   Depends on bidding round */
function canOrderUpSuit(suit){
	if(game.getBiddingRound() === 1){
		if(game.getTrumpCandidate().suit !== suit) return false;
		if(hasSuit(suit)) return true;
	}
	if(game.getBiddingRound() === 2){
		if(game.getTrumpCandidate().suit === suit) return false;
		if(hasSuit(suit)) return true;
	}
	return false;
}

//how many cards of a given suit you have
function numCardsOfSuit(suit){
	var count = 0;
	var hand = myHand();
	for(var i=0; i<hand.length; i++){
		if(hand[i].suit === suit) count++;
	}
	return count;
}

//number of suits you're holding
function countSuits(){
	var suitArray = {"S":0, "D":0, "C":0, "H":0};
	var hand = myHand();
	for(var i=0; i<hand.length; i++){
		suitArray[hand[i].suit] = 1;
	}
	return suitArray["S"] + suitArray["D"] + suitArray["C"] + suitArray["H"];
}

function getOppositeSuit(suit){
	return suits.props[suit].opposite;
}

function getCardValue(card){
	var value;

	value = card.rank;
	if(isTrump(card)) value += 100;
	return value;
}

function getWorstCard(mustBeLegal){
	var worstCard;
	var worstValue = 1000;
	var value;
	var hand = myHand();

	for(var i=0; i<hand.length; i++){
		if(mustBeLegal && !isValidPlay(hand[i])) continue;
		value = getCardValue(hand[i]);
		if(value < worstValue){
			worstCard = hand[i];
			worstValue = value;
		}
	}
	return worstCard;
}

function getBestCard(mustBeLegal){
	var bestCard;
	var bestValue = 0;
	var value;
	var hand = myHand();

	for(var i=0; i<hand.length; i++){
		if(mustBeLegal && !isValidPlay(hand[i])) continue;
		value = getCardValue(hand[i]);
		if(value > bestValue){
			bestCard = hand[i];
			bestValue = value;
		}
	}
	return bestCard;
}
