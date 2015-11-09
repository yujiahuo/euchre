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
		console.log(hands[i][0].id + " " + hands[i][1].id + " " + hands[i][2].id + " " + hands[i][3].id + " " + hands[i][4].id + " ");
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
	console.log(playerNamesMap[dealerID] + dealerID + " is the dealer.");
}

function getShuffledDeck(){
	var pos,temp,size;
	size = 24;

	deck = [new Card("C","9"),
			new Card("C","10"),
			new Card("C","J"),
			new Card("C","Q"),
			new Card("C","K"),
			new Card("C","A"),
			new Card("S","9"),
			new Card("S","10"),
			new Card("S","J"),
			new Card("S","Q"),
			new Card("S","K"),
			new Card("S","A"),
			new Card("D","9"),
			new Card("D","10"),
			new Card("D","J"),
			new Card("D","Q"),
			new Card("D","K"),
			new Card("D","A"),
			new Card("H","9"),
			new Card("H","10"),
			new Card("H","J"),
			new Card("H","Q"),
			new Card("H","K"),
			new Card("H","A")
			]

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
		if(hands[playerID][i].id == cardID){
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
		if(biddingRound == 1){
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

	if(currentPlayerID == 0){
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
	leftSuit = leftMap[trump];
	makerID = playerID;
}

//return 1 if left, 2 if right
function isLeftOrRight(card){
	if(card.number == "J"){
		if(card.suit == trump){
			return 2;
		}
		else if(card.suit == leftSuit){
			return 1;
		}
	}
}

///////////////////
// Player bidding actions
///////////////////

function pickOrderUp(){
	if(dealerID != 0){
		aiDiscard();
		giveDealerTrump();
	}

	setTrump(trumpCandidate, 0);
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

