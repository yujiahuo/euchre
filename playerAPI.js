function addToHand(player, card){
	hands[player].push(card);
}

//finds index of given ID inefficiently
//splice removes 1 at a given index
//fails silently if card isn't found, which should never happen
function removeFromHand(player, card){
	var cardID = card.id;
	
	for(var i=0; i<hands[player].length; i++){
		if(hands[player][i].id === cardID){
			hands[player].splice(i, 1);
		}
	}
}

function takeTrumpCandidate(player, toDiscard){
	removeFromHand(player, toDiscard);
	addToHand(player, toDiscard);
	
	animTakeTrump(player, toDiscard.id);
}

function giveDealerTrump(){
	hands[dealer].push(trumpCandidate);
}

function setTrump(suit, player){
	trump = suit;
	rightID = trump + ranks.JACK;
	DECKDICT[rightID].rank = ranks.RIGHT;
	//left temporarily becomes trump suit. IDs don't change, just suit and rank
	//the html elem id will NOT change
	leftID = suits.props[trump].opposite + ranks.JACK;
	DECKDICT[leftID].suit = trump;
	DECKDICT[leftID].rank = ranks.LEFT;

	if(player===players.SOUTH || player===players.NORTH){
		makers = "ns";
	}
	else{
		makers = "we";
	}

	animShowText("Trump is "+ trump);
	animShowText("Makers are " + makers);
}

function disableActions(){
	document.getElementById("blanket").style.display = "inline";
}

function enableActions(){
	document.getElementById("blanket").style.display = "none";
}

/**********************************************************
/* Player stuff
***********************************************************/

function followsSuit(card){
	if(trickSuit === ""){
		return true;
	}
	if(card.suit === trickSuit){
		return true;
	}
	return false;
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

function isTrump(card){
	return card.suit===trump;
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

/*************************
* Player bidding actions
**************************/

function pickOrderUp(player){
	setTrump(trumpCandidate.suit, player);
	animDisableBidding();
	
	if(dealer !== players.SOUTH || statMode){
		disableActions();
		aiPickUp(dealer);
		giveDealerTrump();
		startTricks();
		return;
	}
	
	enableActions();
}

function pickTrump(suit, player){
	disableActions();
	setTrump(suit, player);
	animDisableBidding();
	startTricks();
}

function pass(player){
	disableActions();
	animDisableBidding();
	console.log("You passed");
	playersBid += 1;
	nextPlayer();
	setTimeout(doBidding, 1000);
}
