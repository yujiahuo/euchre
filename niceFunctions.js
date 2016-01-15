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

//gives trump to the dealer
function takeTrumpCandidate(toDiscard){
	giveDealerTrump();
	removeFromHand(dealer, toDiscard);
	
	animTakeTrump(toDiscard.id);
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

/*************************
* Player bidding actions
**************************/

function pickOrderUp(player){
	setTrump(trumpCandidate.suit, player);
	animDisableBidding();
	
	if(dealer !== players.SOUTH || statMode){
		disableActions();
		aiPickUp(dealer);
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
