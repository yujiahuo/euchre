//The beginning of a hand. A hand involves picking a dealer,
//bidding, and playing until someone wins the hand.
//This resets all the relevant variables
function newHand(redealing){
	//trump is set and all players have their starting hands
	//sortHands(); eventually
	if(!redealing){
		handNum = handNum + 1;
	}
	console.log("starting hand " + handNum + ", redealing = " + redealing);
	
	resetHands();
	animClearTable();
	animDisableBidding();
	
	pickDealer();
	dealHands();
	currentPlayer = dealer;
	nextPlayer();

	if(statMode){
		doBidding();
	}
	else{
		setTimeout(doBidding, 2300);
	}
}

function resetHands(){
	deck = [];
	getShuffledDeck();
	hands = new Array(4);
	for(var i=0; i<4; i++){
		this.hands[i] = new Array(5);
	}

	isBidding = true;
	biddingRound = 0;
	playersBid = 0;

	trumpCandidate = "";
	trump = "";
	dealer = players.NONE;
	alonePlayer = players.NONE;

	nsTricksWon = 0;
	weTricksWon = 0;
}

function pickDealer(){
	//if we have a dealer, get the next dealer
	if(dealer !== players.NONE){
		dealer = (dealer+1)%4;
	}
	//otherwise just randomly grab one
	else{
		dealer = Math.floor(Math.random() * 4);
	}
	animPlaceDealerButt(dealer);
}

function getShuffledDeck(){
	var pos,temp,size;
	size = SORTEDDECK.length;

	deck = [];
	for(var i=0; i<size; i++){
		deck.splice(Math.floor(Math.random() * (i+1)), 0, SORTEDDECK[i]);
	}
}

function dealHands(){
	var player, cardPos, card;

	biddingRound = 1;
	playersBid = 0;

	for(var i=0; i<20; i++){
		player = (dealer+i)%4;
		
		cardPos = Math.floor(i/4);
		card = deck.pop();
		hands[player][cardPos] = card;
	}

	trumpCandidate = deck.pop();
	
	animDeal();
}


/***********
 * Bidding
 ***********/

function doBidding(){
	//end of round of bidding
	if(playersBid > 3){
		if(biddingRound === 1){
			//reset everything and execute rest of the function
			biddingRound = 2;
			playersBid = 0;
			console.log("round 2 bidding starting");
		}
		else{
			//everyone passed, reshuffle
			console.log("everyone passed")
			setTimeout(newHand, 1000, true);
			return;
		}
	}

	if(currentPlayer === players.SOUTH){
		console.log("Your turn");
		animEnableBidding();
	}
	else{
		aiDecideOrderUp();
	}
}

/**************
 * End of Hand
 **************/

function endHand(){
	DECKDICT[rightID].rank = ranks.JACK;
	DECKDICT[leftID].suit = suits.props[DECKDICT[leftID].suit].opposite;
	DECKDICT[leftID].rank = ranks.JACK;

	updateScore();
}

function updateScore(){
	if(nsTricksWon > weTricksWon){
		//got all tricks or euchred other team
		if(nsTricksWon===5 || makers==="we"){
			nsScore += 2;
		}
		else{
			nsScore += 1;
		}
	}
	else if(weTricksWon > nsTricksWon){
		//got all tricks or euchred other team
		if(weTricksWon===5 || makers==="ns"){
			weScore += 2;
		}
		else{
			weScore += 1;
		}
	}
	else{
		console.log("something went horribly wrong with scoring");
	}
	animShowScore();
}