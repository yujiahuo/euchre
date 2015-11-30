function dealHands(){
	var player, cardNum, card;

	placeDeck();
	biddingRound = 1;
	playersBid = 0;

	for(var i=0; i<20; i++){
		player = (i+dealerID)%4;
		
		cardNum = Math.floor(i/4);
		card = deck.pop();
		hands[player][cardNum] = card;

		setTimeout(animDeal, i*100, playerNamesMap[player], card.id, cardNum);
	}

	trumpCandidate = deck.pop();
	setTimeout(animFlipTrump, 2100, trumpCandidate.id);
}

//The beginning of a hand. A hand involves picking a dealer,
//bidding, and playing until someone wins the hand.
//This resets all the relevant variables
function newHand(redealing){
	//trump is set and all players have their starting hands
	//sortHands(); eventually
	clearTable();

	if(!redealing){
		handNum = handNum + 1;
	}
	console.log("starting hand " + handNum + ", redealing = " + redealing);
	pickDealer();
	getShuffledDeck();

	dealHands();

	for(var i=0; i<4; i++){
		console.log(hands[i][0].id + " "
		+ hands[i][1].id + " "
		+ hands[i][2].id + " "
		+ hands[i][3].id + " "
		+ hands[i][4].id + " ");
	}

	currentPlayerID = dealerID;
	nextPlayer();
	setTimeout(doBidding, 2300);
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

	deck = sortedDeck;

	for(var i=0; i<size; i++){
		pos = Math.floor(Math.random() * size)
		temp = deck[i];
		deck[i] = deck[pos];
		deck[pos] = temp;
	}
}

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

function resetHands(){
	hands = new Array(4);
	for(var i=0; i<4; i++){
		hands[i] = new Array(5);
	}
	getShuffledDeck();
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
			setTimeout(redeal, 1000);
			return;
		}
	}

	if(currentPlayerID === 0){
		console.log("Your turn");
		promptOrderUp();
	}
	else{
		aiDecideOrderUp();
	}
}

function promptOrderUp(){
	var elem;

	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "inline";
}

function endHand(){
	deckDict[rightID].suit = deckDict[rightID].id[0];
	deckDict[rightID].number = "J";
	deckDict[rightID].suit = deckDict[rightID].id[0];
	deckDict[leftID].number = "J";
	//determine winner
}

function redeal(){
	console.log("redealing");
	resetHands();
	animReturnHands();

	newHand(1);
}

function setTrump(suit, playerID){
	var elem;
	
	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "none";

	trump = suit;
	rightID = trump + "J";
	deckDict[rightID].suit = trump;
	deckDict[rightID].number = "J1";
	//left temporarily becomes trump suit. IDs don't change, just suit and num
	//the html elem id will NOT change
	leftID = leftMap[trump] + "J";
	deckDict[leftID].suit = trump;
	deckDict[leftID].number = "J2";

	makerID = playerID;
}

///////////////////
// Player bidding actions
///////////////////

function pickOrderUp(){
	if(dealerID !== 0){
		aiDiscard();
		giveDealerTrump();
	}

	setTrump(trumpCandidate.suit, 0);
	setTimeout(startTricks, 1000);
}

function pickSpades(){
	setTrump("S", 0);
	setTimeout(startTricks, 1000);
}

function pickClubs(){
	setTrump("C", 0);
	setTimeout(startTricks, 1000);
}

function pickHearts(){
	setTrump("H", 0);
	setTimeout(startTricks, 1000);
}

function pickDiamonds(){
	setTrump("D", 0);
	setTimeout(startTricks, 1000);
}

function pass(){
	var elem;
	
	elem = document.getElementById("orderUpPrompt");
	elem.style.display = "none";
	console.log("You passed");
	playersBid += 1;
	nextPlayer();
	setTimeout(doBidding, 1000);
}

