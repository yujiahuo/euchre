//The beginning of a hand. A hand involves picking a dealer,
//bidding, and playing until someone wins the hand.
//This resets all the relevant variables
function newHand(redealing){
	//trump is set and all players have their starting hands
	//sortHands(); eventually
	resetHands();
	animClearTable();


	if(!redealing){
		handNum = handNum + 1;
	}
	console.log("starting hand " + handNum + ", redealing = " + redealing);
	pickDealer();
	dealHands();

	currentPlayerID = dealerID;
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

	isBidding = false;
	biddingRound = 0;
	playersBid = 0;

	trumpCandidate = "";
	trump = "";
	dealerID = -1;
	makerID = -1;
	alonePlayerID = -1;

	nsTricksWon = 0;
	weTricksWon = 0;
}

function pickDealer(){
	//if we have a dealer, get the next dealer
	if(dealerID > -1){
		dealerID = (dealerID+1)%4;
	}
	//otherwise just randomly grab one
	else{
		dealerID = Math.floor(Math.random() * 4);
	}
	animPlaceDealerButt(dealerID);
}

function getShuffledDeck(){
	var pos,temp,size;
	size = 24;

	deck = SORTEDDECK.slice(0);

	for(var i=0; i<size; i++){
		pos = Math.floor(Math.random() * size)
		temp = deck[i];
		deck[i] = deck[pos];
		deck[pos] = temp;
	}
}

function dealHands(){
	var playerID, cardPos, card;

	biddingRound = 1;
	playersBid = 0;

	for(var i=0; i<20; i++){
		playerID = (i+dealerID)%4;
		
		cardPos = Math.floor(i/4);
		card = deck.pop();
		hands[playerID][cardPos] = card;
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

	if(currentPlayerID === 0){
		console.log("Your turn");
		animEnableBidding();
	}
	else{
		aiDecideOrderUp();
	}
}


/*************************
* Player bidding actions
**************************/

function pickOrderUp(){
	disableActions();
	if(dealerID !== 0){
		aiDiscard();
		giveDealerTrump();
	}

	setTrump(trumpCandidate.suit, 0);
	animDisableBidding();
	startTricks();
}

function pickSpades(){
	disableActions();
	setTrump("S", 0);
	animDisableBidding();
	startTricks();
}

function pickClubs(){
	disableActions();
	setTrump("C", 0);
	animDisableBidding();
	startTricks();
}

function pickHearts(){
	disableActions();
	setTrump("H", 0);
	animDisableBidding();
	startTricks();
}

function pickDiamonds(){
	disableActions();
	setTrump("D", 0);
	animDisableBidding();
	startTricks();
}

function pass(){
	disableActions();
	animDisableBidding();
	console.log("You passed");
	playersBid += 1;
	nextPlayer();
	setTimeout(doBidding, 1000);
}

/**************
 * End of Hand
 **************/

function endHand(){
	DECKDICT[rightID].suit = DECKDICT[rightID].id[0];
	DECKDICT[rightID].number = "J";
	DECKDICT[rightID].suit = DECKDICT[rightID].id[0];
	DECKDICT[leftID].number = "J";

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