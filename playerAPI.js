//returns true if card2 is greater than card1 for this hand
function isGreater(card1, card2){
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

function isValidPlay(player, card){
	if(!canFollowSuit(player)){
		return true;
	}
	if(followsSuit(card)){
		return true;
	}
	return false;
}

function isTrump(card){
	return card.suit===trump;
}

function followsSuit(card){
	if(trickSuit === ""){
		return true;
	}
	if(card.suit === trickSuit){
		return true;
	}
	return false;
}

function canFollowSuit(player){
	return hasSuit(trickSuit, player);
}

function hasSuit(suit, player){
	for(var i=0; i<hands[player].length; i++){
		if(hands[player][i].suit === suit) return true;
	}
	return false;
}

/* Returns whether or not it is currently legal for the given player to
   order up a given suit.
   Depends on bidding round */
function canOrderUpSuit(suit, player){
	if(biddingRound === 1){
		if(trumpCandidate.suit !== suit) return false;
		if(hasSuit(suit, player)) return true;
	}
	if(biddingRound === 2){
		if(trumpCandidate.suit === suit) return false;
		if(hasSuit(suit, player)) return true;
	}
	return false;
}
