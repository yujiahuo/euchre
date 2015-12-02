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
}