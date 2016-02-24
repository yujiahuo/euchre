/*******************************
* Nice totes public utilities
********************************/

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
function canOrderUpSuit(suit, player){
	if(game.getBiddingRound() === 1){
		if(game.getTrumpCandidate().suit !== suit) return false;
		if(hasSuit(suit, player)) return true;
	}
	if(game.getBiddingRound() === 2){
		if(game.getTrumpCandidate().suit === suit) return false;
		if(hasSuit(suit, player)) return true;
	}
	return false;
}

function myHand(){
	return game.myHand();
}
