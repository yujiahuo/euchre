function addToHand(playerID, card){
	hands[playerID].push(card);
}

//finds index of given ID inefficiently
//splice removes 1 at a given index
//fails silently if card isn't found, which should never happen
function removeFromHand(playerID, cardID){
	for(var i=0; i<hands[playerID].length; i++){
		if(hands[playerID][i].id === cardID){
			hands[playerID].splice(i, 1); //it's called splice? weird huh?
		}
	}
}

function giveDealerTrump(){
	hands[dealerID].push(trumpCandidate);
}

function setTrump(suit, playerID){
	trump = suit;
	rightID = trump + "J";
	DECKDICT[rightID].suit = trump;
	DECKDICT[rightID].number = "J1";
	//left temporarily becomes trump suit. IDs don't change, just suit and num
	//the html elem id will NOT change
	leftID = leftMap[trump] + "J";
	DECKDICT[leftID].suit = trump;
	DECKDICT[leftID].number = "J2";

	if(playerID===0 || playerID===2){
		makers = "ns";
	}
	else{
		makers = "we";
	}

	animShowText("Trump is "+ trump);
	animShowText("Makers are " + makers);
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

/**********************************************************
/* Player stuff
***********************************************************/

function canFollowSuit(playerID){
	for(var i=0; i<hands[playerID].length; i++){
		if(hands[playerID][i].suit===trickSuit){
			return true;
		}
	}
	return false;
}

function isValidPlay(playerID, card){
	if(!canFollowSuit(playerID)){
		return true;
	}
	if(followsSuit(card)){
		return true;
	}
	return false;
}

//returns true if card2 is creater than card1 for this hand
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
	if(cardHierarchy[card1.number] > cardHierarchy[card2.number]){
		return false;
	}
	else{
		return true;
	}
}

function isTrump(card){
	return card.suit===trump;
}

function disableActions(){
	document.getElementById("blanket").style.display = "inline";
}

function enableActions(){
	document.getElementById("blanket").style.display = "none";
}